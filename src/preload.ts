// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts
import { GenerateContentResponse, createPartFromUri } from '@google/genai';
import { contextBridge, ipcRenderer } from 'electron';
import ElectronStore from 'electron-store';

import { Settings } from '~/types/Settings';
import { Tool } from '~/types/Tool';
import { client } from '~/lib/gemini';

declare global {
  interface Window {
    GeminiSiri: {
      /* Settings */
      settings: Settings;
      getSettings: (reloadFn?: (newVal?: Settings, oldVal?: Settings) => void) => Settings;
      putSettings: (settings: Settings) => void;

      /* Tools */
      getAvailableTools: () => Promise<Tool[]>;
      runTool: (toolId: string, args?: Record<string, unknown>) => Promise<Record<string, unknown>>;

      /* Model */
      saveSelectedModel: (modelId: string) => void;
      pingModel: () => Promise<boolean>;
      sendMessage: (message: string) => Promise<string>;
    };
  }
}

const MAX_TOOLS_ITERATIONS = 3; // TODO into settings
const settings = new ElectronStore<Settings>();

contextBridge.exposeInMainWorld('GeminiSiri', {
  /* Settings */
  settings: settings.store,
  getSettings(reloadFn?: (newVal?: Settings, oldVal?: Settings) => void) {
    if (reloadFn != null) {
      settings.onDidAnyChange(reloadFn);
    }

    return settings.store;
  },
  putSettings(settingsObj: Settings) {
    settings.set(settingsObj);
  },

  /* Tools */
  async getAvailableTools() {
    return await ipcRenderer.invoke('get-available-tools');
  },
  async runTool(toolId: string, args?: Record<string, unknown>) {
    return ipcRenderer.invoke('run-tool', toolId, args);
  },

  /* Model */
  saveSelectedModel(modelId: string) {
    settings.set('geminiModelId', modelId);
  },
  async pingModel() {
    const res = await client.models.generateContent({
      model: settings.get('geminiModelId'),
      contents: 'Ping!',
    });

    return res.text === 'Ping!' || res.text === 'Pong!';
  },
  async sendMessage(message: string) {
    const model = settings.store.geminiModelId;
    const availableTools: Tool[] = await ipcRenderer.invoke('get-available-tools');
    const enabledTools = settings.store.enabledTools;
    const toolsForMessage = availableTools
      .filter((tool) => enabledTools.includes(tool.id))
      .map((tool) => ({
        name: tool.id,
        description: tool.description,
        parameters: tool.parameters,
        required: tool.required,
      }));

    const contents = [
      {
        role: 'user',
        parts: [{ text: `${message} Use the provided tool(s) preemptively, don't wait for user's response!` }],
      },
    ];
    let i = 0;
    let res: GenerateContentResponse;
    do {
      i++;
      res = await client.models.generateContent({
        config: {
          tools: [{ functionDeclarations: toolsForMessage }],
        },
        contents,
        model,
      });
      if (!res.functionCalls?.length) {
        return res.text;
      }

      contents.push({ role: 'model', parts: [{ text: JSON.stringify(res.functionCalls) }] });

      const functionCallResults = await Promise.all(
        res.functionCalls.map(async (fc): Promise<[string, Record<string, unknown>]> => [fc.name!, await this.runTool(fc.name, fc.args)]),
      );
      console.log('>>> prld:loop.functionCallResults', functionCallResults);

      // Check if photos_get_last_photo was called
      const photoToolCall = functionCallResults.find(([name]) => name === 'photos_get_last_photo');
      if (photoToolCall) {
        const [name, result] = photoToolCall as [string, { lastPhotoFilePath: string }];
        const photoPath = result.lastPhotoFilePath;
        const uploadRes = await ipcRenderer.invoke('upload-image', photoPath);
        const part = createPartFromUri(uploadRes.uri, uploadRes.mimeType);
        if (part.fileData == null) {
          throw new Error('Failed to upload photo to Google Cloud Storage. Empty fileData.');
        }

        contents.push({
          role: 'user',
          parts: [
            { text: JSON.stringify({ name, result }) },
            // @ts-expect-error createPartFromUri returns part without text
            part,
          ],
        });
      } else {
        contents.push({
          role: 'user',
          parts: [{ text: JSON.stringify(functionCallResults.map(([name, result]) => ({ [name]: result }))) }],
        });
      }
      console.log('>>> prld:loop.contents', contents);
    } while (i < MAX_TOOLS_ITERATIONS);

    return res.text;
  },
});

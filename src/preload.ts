// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts
import { GenerateContentResponse } from '@google/genai';
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
        parts: [{ text: `${message} Use the provided tool(s) preemptively!` }],
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

      const functionCallResults = await Promise.all(res.functionCalls.map(async (fc) => [fc.name, await this.runTool(fc.name, fc.args)]));
      contents.push({
        role: 'user',
        parts: [{ text: JSON.stringify(functionCallResults.map(([name, result]) => ({ [name]: result }))) }],
      });
    } while (i < MAX_TOOLS_ITERATIONS);

    return res.text;
  },
});

// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts
import { contextBridge, ipcRenderer } from 'electron';
import ElectronStore from 'electron-store';

import { Settings } from '~/types/Settings';
import { Tool } from '~/types/Tool';
import { client } from '~/lib/gemini';

declare global {
  interface Window {
    GeminiSiri: {
      settings: Settings;
      getSettings: (reloadFn?: (newVal?: Settings, oldVal?: Settings) => void) => Settings;
      putSettings: (settings: Settings) => void;

      getAvailableTools: () => Promise<Tool[]>;

      saveSelectedModel: (modelId: string) => void;
      pingModel: () => Promise<boolean>;
    };
  }
}

const settings = new ElectronStore<Settings>();

contextBridge.exposeInMainWorld('GeminiSiri', {
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

  async getAvailableTools() {
    return await ipcRenderer.invoke('get-available-tools');
  },

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
});

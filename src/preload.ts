// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts
import { contextBridge } from 'electron';
import ElectronStore from 'electron-store';

import { Settings } from '~/types/Settings';
import { client } from '~/lib/gemini';

declare global {
  interface Window {
    GeminiSiri: {
      settings: Settings;
      putSettings: (settings: Settings) => void;
      saveSelectedModel: (modelId: string) => void;
      pingModel: () => Promise<boolean>;
    };
  }
}

const settings = new ElectronStore<Settings>();

contextBridge.exposeInMainWorld('GeminiSiri', {
  settings: settings.store,
  putSettings(settingsObj: Settings) {
    settings.set(settingsObj);
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

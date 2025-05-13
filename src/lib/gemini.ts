import { GoogleGenAI } from '@google/genai';
import ElectronStore from 'electron-store';

import { Settings } from '~/types/Settings';

const settings = new ElectronStore<Settings>();
export const client = new GoogleGenAI({ apiKey: settings.get('geminiApiKey') });

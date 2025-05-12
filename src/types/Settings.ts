import type { Tool } from './Tool';

export type Settings = {
  geminiApiKey: string;
  geminiModelId: string;
  mainWindowPosition: number[];
  tools: Tool[];
};

import type { Tool } from './Tool';

export type Settings = {
  geminiApiKey: string;
  mainWindowPosition: number[];
  tools: Tool[];
};

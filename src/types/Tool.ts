import { Type } from '@google/genai';

export type Tool = {
  id: string;
  name: string;
  description: string;
  parameters?: {
    type: Type;
    description: string;
  };
  required?: string[];
};

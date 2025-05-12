import { useState } from 'react';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '~/components/ui/Select';

type Props = {
  onSubmit: () => void;
  onModelChange: (modelId: string) => void;
  savedModelId: string;
};

export default function PromptArea({ onSubmit, onModelChange, savedModelId }: Props) {
  const [selectedModelId, setSelectedModelId] = useState(savedModelId);

  return (
    <main className="flex flex-col rounded-md border border-primary-200 bg-primary-700 shadow-sm">
      <textarea
        placeholder="Describe the task to the AI assistant"
        className="h-30 w-full resize-none p-2 text-lg text-primary-50 placeholder:text-gray-500 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
      />

      <aside className="flex items-center justify-between gap-4 p-2">
        <Select
          onValueChange={(val) => {
            setSelectedModelId(val);
            onModelChange(val);
          }}
          value={selectedModelId}
        >
          <SelectTrigger className="h-7 w-[220px]">
            <SelectValue placeholder="Select model" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="gemini-2.5-pro-preview-05-06">Gemini 2.5 Pro</SelectItem>
              <SelectItem value="gemini-2.5-flash-preview-04-17">Gemini 2.5 Flash</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>

        <button
          className="h-6 w-6 bg-primary-200 mask-[url('./assets/icons/send.svg')] text-3xl hover:bg-primary-50"
          title="Submit"
          onClick={onSubmit}
        />
      </aside>
    </main>
  );
}

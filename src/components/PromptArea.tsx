type Props = {
  onSubmit: () => void;
};

export default function PromptArea({ onSubmit }: Props) {
  return (
    <main className="flex flex-col rounded-md border border-primary-200 bg-primary-700 shadow-sm">
      <textarea
        placeholder="Describe the task to the AI assistant"
        className="h-30 w-full resize-none p-2 text-lg text-primary-50 placeholder:text-gray-500 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
      />

      <aside className="flex items-center justify-between p-2">
        <span />
        <button
          className="h-6 w-6 bg-primary-200 mask-[url('./assets/icons/send.svg')] text-3xl hover:bg-primary-50"
          title="Submit"
          onClick={onSubmit}
        />
      </aside>
    </main>
  );
}

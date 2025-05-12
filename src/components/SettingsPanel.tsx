import { useEffect, useState } from 'react';

import { Settings } from '~/types/Settings';
import { Tool } from '~/types/Tool';
import Switch from '~/components/ui/Switch';

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onSaveSettings: (settings: Settings) => void;
};

export default function SettingsPanel({ isOpen, onClose, onSaveSettings }: Props) {
  const [settings, setSettings] = useState<Settings>();
  const [availableTools, setAvailableTools] = useState<Tool[]>([]);

  function toggleTool(toolId: string) {
    if (settings == null) return;
    if (!availableTools.find((t) => t.id === toolId)) return;

    const enabledTools = settings.enabledTools.includes(toolId) // is tool enabled
      ? [...settings.enabledTools.filter((et) => et !== toolId)]
      : [...settings.enabledTools, toolId];

    onSaveSettings({ ...settings, enabledTools });
  }

  useEffect(() => {
    setSettings(window.GeminiSiri.getSettings(setSettings));
    window.GeminiSiri.getAvailableTools().then(setAvailableTools);
  }, []);

  if (settings == null || availableTools == null) {
    return null;
  }

  return (
    <>
      {/* Backdrop */}
      {isOpen && <div className="bg-opacity-20 fixed inset-0 z-10 bg-black" onClick={onClose} />}

      {/* Panel */}
      <main
        className={`fixed top-0 right-0 bottom-0 z-20 flex w-4/5 transform flex-col gap-4 bg-primary-400 p-4 pt-2 shadow-lg transition-transform duration-200 ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <section className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Settings</h2>
          <button onClick={onClose} className="p-1 text-primary-200 hover:text-primary-50">
            ✕
          </button>
        </section>

        <section className="flex flex-1 flex-col justify-between gap-2">
          <div className="flex flex-col gap-4">
            <article className="flex flex-col gap-4 overflow-y-auto">
              <div className="flex flex-col gap-2">
                <label htmlFor="api-key">Gemini API key</label>
                <input
                  className="flex h-9 w-full rounded-md border border-primary-200 bg-transparent p-2 shadow-sm placeholder:text-gray-500 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                  type="password"
                  id="api-key"
                  placeholder="Enter your Gemini API key"
                  value={settings.geminiApiKey}
                  onChange={(ev) => setSettings({ ...settings, geminiApiKey: ev.target.value })}
                />
              </div>
            </article>

            <article className="">
              <h2 className="py-3 text-3xl">Available tools</h2>
              <ul className="flex flex-col gap-4 px-2">
                {availableTools.map((tool) => (
                  <li key={tool.id} className="grid grid-cols-[1fr_36px] grid-rows-[auto_1fr] items-start gap-x-2">
                    <h3 className="text-xl" title={tool.id}>
                      {tool.name}
                    </h3>
                    <Switch
                      id={tool.id}
                      className="self-center"
                      checked={settings.enabledTools.includes(tool.id)}
                      onClick={() => toggleTool(tool.id)}
                    />
                    <p className="col-span-2 text-sm leading-tight text-primary-200">{tool.description}</p>
                  </li>
                ))}
              </ul>
            </article>
          </div>

          <article className="flex justify-end">
            <button
              className="rounded-md border border-primary-200 bg-primary-300 px-4 py-2 hover:border-primary-100 hover:text-primary-50 active:bg-primary-300/60 active:inset-shadow-[0_2px_rgba(0,0,0,0.25),0_-1px_rgba(255,255,255,0.5)] disabled:cursor-not-allowed disabled:opacity-50"
              onClick={() => onSaveSettings(settings)}
            >
              Save
            </button>
          </article>
        </section>
      </main>
    </>
  );
}

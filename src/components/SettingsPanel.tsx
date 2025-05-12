import { useState } from 'react';

import { Settings } from '~/types/Settings';

type Props = {
  isOpen: boolean;
  onClose: () => void;
  initialSettings: Settings;
  onSaveSettings: (settings: Settings) => void;
};

export default function SettingsPanel({ isOpen, onClose, initialSettings, onSaveSettings }: Props) {
  const [settings, setSettings] = useState(initialSettings);

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

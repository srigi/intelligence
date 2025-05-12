import { useRef, useState } from 'react';

import Navbar from '~/components/Navbar';
import LogoStagedLoader, { RefType as LoaderRefType } from '~/components/LogoStagedLoader';
import SettingsPanel from '~/components/SettingsPanel';
import PromptArea from '~/components/PromptArea';
import { delay } from '~/utils/delay';
import { useToast } from '~/hooks/useToast';
import cn from '~/utils/cn';

export function App() {
  const [isModelCommunicating, setIsModelCommunicating] = useState(false);
  const [isSettingsPanelOpen, setIsSettingsPanelOpen] = useState(false);
  const logoLoaderRef = useRef<LoaderRefType>(null);
  const [modelMessages, setModelMessages] = useState<string[]>([]);
  const { Toaster, showToast } = useToast();

  async function handleModelTest() {
    if (logoLoaderRef.current == null) {
      return;
    }

    logoLoaderRef.current.start();
    await delay(1000);
    const result = await window.GeminiSiri.pingModel();

    await logoLoaderRef.current.stop();
    await delay(100);

    showToast({
      description: result ? 'Model is working' : "Model isn't NOT working!",
      variant: result ? 'default' : 'destructive',
    });
  }

  return (
    <>
      <Toaster />
      <Navbar onSettingsClick={() => setIsSettingsPanelOpen(!isSettingsPanelOpen)} />
      <SettingsPanel
        isOpen={isSettingsPanelOpen}
        onClose={() => setIsSettingsPanelOpen(false)}
        onSaveSettings={window.GeminiSiri.putSettings}
      />

      <section className="relative flex flex-1 flex-col items-center justify-center">
        <LogoStagedLoader
          ref={logoLoaderRef}
          width={isModelCommunicating || modelMessages.length ? 36 : 128}
          className={cn('absolute transition-all', (isModelCommunicating || modelMessages.length) && '-top-8 left-0')}
        />

        {modelMessages.length > 0 && (
          <main className="max-h-[calc(100vh_-_228px)] overflow-y-auto px-4">
            {modelMessages.map((mm) => (
              <p className="py-2">{mm}</p>
            ))}
          </main>
        )}
      </section>

      <PromptArea
        onSubmit={async (message) => {
          if (logoLoaderRef.current == null) return;

          logoLoaderRef.current.start();
          setIsModelCommunicating(true);

          const result = await window.GeminiSiri.sendMessage(message);
          setModelMessages(result.split('\n'));
          logoLoaderRef.current.stop().then(() => setIsModelCommunicating(false));
        }}
        onModelChange={window.GeminiSiri.saveSelectedModel}
        onModelTest={handleModelTest}
        savedModelId={window.GeminiSiri.settings.geminiModelId}
        submittingEnabled={window.GeminiSiri.settings.geminiApiKey != null && window.GeminiSiri.settings.geminiApiKey !== ''}
      />
    </>
  );
}

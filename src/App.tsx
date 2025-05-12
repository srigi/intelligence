import { useRef, useState } from 'react';

import Navbar from '~/components/Navbar';
import LogoStagedLoader, { RefType } from '~/components/LogoStagedLoader';
import SettingsPanel from '~/components/SettingsPanel';
import PromptArea from '~/components/PromptArea';
import { delay } from '~/utils/delay';
import { useToast } from '~/hooks/useToast';

export function App() {
  const [isSettingsPanelOpen, setIsSettingsPanelOpen] = useState(false);
  const logoLoaderRef = useRef<RefType>(null);
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

      <section className="flex flex-1 flex-col items-center justify-center">
        <LogoStagedLoader ref={logoLoaderRef} />
      </section>

      <PromptArea
        onSubmit={() => {
          if (logoLoaderRef.current != null) {
            if (logoLoaderRef.current.isAnimating) {
              logoLoaderRef.current.stop();
            } else {
              logoLoaderRef.current.start();
            }
          }
        }}
        onModelChange={window.GeminiSiri.saveSelectedModel}
        onModelTest={handleModelTest}
        savedModelId={window.GeminiSiri.settings.geminiModelId}
        submittingEnabled={window.GeminiSiri.settings.geminiApiKey != null && window.GeminiSiri.settings.geminiApiKey !== ''}
      />
    </>
  );
}

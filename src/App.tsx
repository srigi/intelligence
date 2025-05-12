import { useRef, useState } from 'react';

import { ToastRoot, ToastDescription, ToastViewport } from '~/components/ui/Toast';
import Navbar from '~/components/Navbar';
import LogoStagedLoader, { RefType } from '~/components/LogoStagedLoader';
import SettingsPanel from '~/components/SettingsPanel';
import PromptArea from '~/components/PromptArea';
import { delay } from '~/utils/delay';

export function App() {
  const [isSettingsPanelOpen, setIsSettingsPanelOpen] = useState(false);
  const [toastContent, setToastContent] = useState<string>();
  const [isToastOpen, setIsToastOpen] = useState(false);
  const logoLoaderRef = useRef<RefType>(null);

  async function handleModelTest() {
    if (logoLoaderRef.current == null) {
      return;
    }

    logoLoaderRef.current.start();
    await delay(1000);
    const result = await window.GeminiSiri.pingModel();
    setToastContent(result ? 'Model is working' : "Model isn't NOT working!");

    await logoLoaderRef.current.stop();
    await delay(100);
    setIsToastOpen(true);
    await delay(2500);
    setIsToastOpen(false);
  }

  return (
    <>
      <ToastViewport className="ToastViewport" />
      <ToastRoot className="ToastRoot" open={isToastOpen} onOpenChange={setIsToastOpen}>
        <ToastDescription asChild>
          <span>{toastContent}</span>
        </ToastDescription>
      </ToastRoot>

      <Navbar onSettingsClick={() => setIsSettingsPanelOpen(!isSettingsPanelOpen)} />
      <SettingsPanel
        isOpen={isSettingsPanelOpen}
        onClose={() => setIsSettingsPanelOpen(false)}
        initialSettings={window.GeminiSiri.settings}
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

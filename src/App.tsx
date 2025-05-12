import { useRef, useState } from 'react';

import Navbar from '~/components/Navbar';
import LogoStagedLoader, { RefType } from '~/components/LogoStagedLoader';
import SettingsPanel from '~/components/SettingsPanel';
import PromptArea from '~/components/PromptArea';

export function App() {
  const [isSettingsPanelOpen, setIsSettingsPanelOpen] = useState(false);
  const logoLoaderRef = useRef<RefType>(null);

  return (
    <>
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
        savedModelId={window.GeminiSiri.settings.geminiModelId}
      />
    </>
  );
}

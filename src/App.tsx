import { useRef } from 'react';

import LogoStagedLoader, { RefType } from '~/components/LogoStagedLoader';
import Navbar from '~/components/Navbar';
import PromptArea from '~/components/PromptArea';

export function App() {
  const logoLoaderRef = useRef<RefType>(null);

  return (
    <>
      <Navbar />

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
      />
    </>
  );
}

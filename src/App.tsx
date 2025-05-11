import { useRef } from 'react';

import LogoStagedLoader, { RefType } from '~/components/LogoStagedLoader';
import PromptArea from '~/components/PromptArea';

export function App() {
  const logoLoaderRef = useRef<RefType>(null);

  return (
    <>
      <nav className="flex justify-end">
        <button className="h-8 w-8 bg-primary-200 mask-[url('./assets/icons/gear.svg')] text-3xl hover:bg-primary-50" title="Settings" />
      </nav>

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

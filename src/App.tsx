export function App() {
  return (
    <>
      <nav className="flex justify-end">
        <button className="h-8 w-8 bg-primary-200 mask-[url('./assets/icons/gear.svg')] text-3xl hover:bg-primary-50" title="Settings" />
      </nav>
      <section className="flex flex-1 items-center justify-center">
        <img src="./assets/icons/icon.png" alt="icon" className="h-32 w-32 opacity-80" />
      </section>
      <span className="text-3xl">&nbsp;</span>
    </>
  );
}

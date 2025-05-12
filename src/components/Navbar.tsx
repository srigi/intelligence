export default function Navbar() {
  return (
    <nav className="flex justify-end gap-2">
      <button
        className="h-7 w-7 bg-primary-200 mask-[url('./assets/icons/testTubes.svg')] text-3xl hover:bg-primary-50"
        title="Test connection"
      />
      <button
        className="h-8 w-8 bg-primary-200 mask-[url('./assets/icons/gear.svg')] text-3xl hover:bg-primary-50"
        title="Settings"
      />
    </nav>
  );
}

type Props = {
  onSettingsClick: () => void;
};

export default function Navbar({ onSettingsClick }: Props) {
  return (
    <nav className="flex justify-end gap-2">
      <button
        className="h-8 w-8 bg-primary-200 mask-[url('./assets/icons/gear.svg')] text-3xl hover:bg-primary-50"
        title="Settings"
        onClick={onSettingsClick}
      />
    </nav>
  );
}

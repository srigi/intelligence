import { RefObject, useImperativeHandle, useState } from 'react';

export type RefType = {
  isAnimating: boolean;
  start: () => void;
  stop: () => void;
};

type Props = {
  ref: RefObject<RefType | null>;
};

const GIF_DURATION = 1200;

export default function LogoStagedLoader({ ref }: Props) {
  const [animationStartTime, setAnimationStartTime] = useState<Date>();
  const [isAnimating, setIsAnimating] = useState(false);

  useImperativeHandle(ref, () => ({
    isAnimating,

    start: () => {
      setAnimationStartTime(new Date());
      setIsAnimating(true);
    },

    stop: () => {
      if (animationStartTime != null && isAnimating) {
        const now = new Date();
        const runningTime = now.getTime() - animationStartTime.getTime();
        const rest = runningTime < GIF_DURATION ? GIF_DURATION - runningTime : GIF_DURATION - (runningTime % GIF_DURATION);

        setTimeout(() => setIsAnimating(false), rest);
      }
    },
  }));

  return (
    <main className="w-32">
      {isAnimating ? <img src="assets/animations/logo.gif" alt="icon" /> : <img src="assets/icons/icon.png" alt="icon" />}
    </main>
  );
}

import { RefObject, useImperativeHandle, useState } from 'react';

export type RefType = {
  isAnimating: boolean;
  start: () => void;
  stop: () => Promise<void>;
};

type Props = {
  className?: string;
  ref: RefObject<RefType | null>;
  width: number;
};

const GIF_DURATION = 1200;

export default function LogoStagedLoader({ className, ref, width }: Props) {
  const [animationStartTime, setAnimationStartTime] = useState<Date>();
  const [isAnimating, setIsAnimating] = useState(false);

  useImperativeHandle(ref, () => ({
    isAnimating,

    start: () => {
      setAnimationStartTime(new Date());
      setIsAnimating(true);
    },

    stop: () =>
      new Promise<void>((resolve, reject) => {
        if (animationStartTime == null || !isAnimating) {
          return reject();
        }

        const now = new Date();
        const runningTime = now.getTime() - animationStartTime.getTime();
        const rest = runningTime < GIF_DURATION ? GIF_DURATION - runningTime : GIF_DURATION - (runningTime % GIF_DURATION);

        setTimeout(() => {
          setIsAnimating(false);
          resolve();
        }, rest);
      }),
  }));

  return (
    <main className={className} style={{ width }}>
      {isAnimating ? <img src="assets/animations/logo.gif" alt="icon" /> : <img src="assets/icons/icon.png" alt="icon" />}
    </main>
  );
}

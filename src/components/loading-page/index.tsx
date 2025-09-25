import { LoadingLottieAnimation } from './loading-lottie-animation';

export function LoadingPage() {
  return (
    <div className="absolute inset-0 z-[-10] flex flex-col items-center justify-center gap-4">
      <LoadingLottieAnimation className="h-48 w-full max-w-48" />
    </div>
  );
}

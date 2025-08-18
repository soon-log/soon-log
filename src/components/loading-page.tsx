import { LoadingLottieAnimation } from './loading-lottie-animation/loading-lottie-animation';

export function LoadingPage() {
  return (
    <div className="absolute inset-0 z-[-10] flex flex-col items-center justify-center gap-4">
      <LoadingLottieAnimation className="h-96 w-full max-w-96" />
    </div>
  );
}

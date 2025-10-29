import { useEffect, useCallback, RefObject } from 'react';

type UseInfiniteScrollProps = {
  targetRef: RefObject<HTMLElement | null>;
  onIntersect: () => void;
  isLoading: boolean;
  options?: IntersectionObserverInit;
};

export function useInfiniteScroll({
  targetRef,
  onIntersect,
  isLoading,
  options
}: UseInfiniteScrollProps) {
  const handleIntersect = useCallback(
    (entries: Array<IntersectionObserverEntry>) => {
      const [entry] = entries;
      if (entry?.isIntersecting && !isLoading) {
        onIntersect();
      }
    },
    [onIntersect, isLoading]
  );

  useEffect(() => {
    const element = targetRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(handleIntersect, {
      threshold: 0.1,
      ...options
    });

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [handleIntersect, options, targetRef]);
}

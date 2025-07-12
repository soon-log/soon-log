import { useEffect, useCallback, RefObject } from 'react';

export function useInfiniteScroll(
  targetRef: RefObject<HTMLElement | null>,
  onIntersect: () => void,
  options?: IntersectionObserverInit
) {
  const handleIntersect = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const [entry] = entries;
      if (entry?.isIntersecting) {
        onIntersect();
      }
    },
    [onIntersect]
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
  }, [targetRef, handleIntersect, options]);
}

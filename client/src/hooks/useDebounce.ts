import { useRef, useEffect, useCallback } from "react";

type Timer = ReturnType<typeof setTimeout>;

export function useDebounce<Func extends (...args: any[]) => void>(
  func: Func,
  delay = 1000
) {
  const timerRef = useRef<Timer | null>(null);

  const debounced = useCallback(
    (...args: Parameters<Func>) => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }

      timerRef.current = setTimeout(() => {
        func(...args);
      }, delay);
    },
    [func, delay]
  );

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  return debounced;
}

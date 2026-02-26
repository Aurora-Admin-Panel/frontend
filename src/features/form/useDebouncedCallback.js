import { useCallback, useEffect, useRef } from "react";

export default function useDebouncedCallback(callback, delayMs = 0) {
  const callbackRef = useRef(callback);
  const timerRef = useRef(null);

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  const cancel = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const flush = useCallback((...args) => {
    cancel();
    return callbackRef.current?.(...args);
  }, [cancel]);

  const debouncedCallback = useCallback(
    (...args) => {
      cancel();
      timerRef.current = setTimeout(() => {
        timerRef.current = null;
        callbackRef.current?.(...args);
      }, delayMs);
    },
    [cancel, delayMs]
  );

  useEffect(() => cancel, [cancel]);

  return { debouncedCallback, cancel, flush };
}

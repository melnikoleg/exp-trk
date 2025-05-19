import { useCallback, useEffect } from "react";

export const useClickEscape = (callback: () => void) => {
  const escFunction = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        callback();
      }
    },
    [callback],
  );

  useEffect(() => {
    document.addEventListener("keydown", escFunction, false);

    return () => {
      document.removeEventListener("keydown", escFunction, false);
    };
  }, [escFunction]);
};

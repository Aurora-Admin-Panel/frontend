import { useCallback } from "react";
import { useTranslation } from "react-i18next";

// Returns a function that translates only if the key exists; otherwise returns the original string.
// Usage: const maybeT = useMaybeT(); const labelText = maybeT(label);
export default function useMaybeT(ns) {
  const { t, i18n } = useTranslation(ns);

  const maybeT = useCallback(
    (label, options) => {
      if (label == null) return "";
      if (typeof label !== "string") return label;
      try {
        return i18n.exists(label, options) ? t(label, options) : label;
      } catch (_) {
        return label;
      }
    },
    [t, i18n]
  );

  return maybeT;
}


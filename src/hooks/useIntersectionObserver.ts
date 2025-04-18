import { DependencyList, useCallback, useRef } from "react";

export default function useIntersectionObserver<T extends HTMLElement>(
  cb: () => void,
  deps: DependencyList
) {
  const observer = useRef<IntersectionObserver | null>(null);

  const ref = useCallback(
    (node: T) => {
      if (deps.every(Boolean)) {
        observer.current?.disconnect();
        observer.current = new IntersectionObserver((entries) => {
          if (entries[0].isIntersecting) cb();
        });
        if (node) observer.current.observe(node);
      }
    },
    [deps]
  );

  return ref;
}

import { useState, useCallback, useRef } from 'react';

/**
 * A shared ResizeObserver instance is reused across all hook instances
 */
let sharedObserver = null;
const observerCallbacks = new Map();

const getSharedObserver = () => {
  if (!sharedObserver) {
    sharedObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const cb = observerCallbacks.get(entry.target);
        if (cb) cb(entry);
      }
    });
  }
  return sharedObserver;
};

/**
 * useResizeObserver
 *
 * A drop-in replacement for `use-resize-observer` compatible with React 19.
 *
 * @returns {{ ref: Function, width: number | undefined, height: number | undefined }}
 *
 * @example
 * const { ref, width, height } = useResizeObserver();
 * <div ref={ref} style={{ height: '100vh' }}>
 *   <Tree width={width} height={height} ... />
 * </div>
 */
const useResizeObserver = () => {
  const [size, setSize] = useState({ width: undefined, height: undefined });
  const currentNodeRef = useRef(null);

  const measureNode = useCallback((node) => {
    if (!node) return;
    const { width, height } = node.getBoundingClientRect();
    setSize((prev) => {
      if (prev.width === width && prev.height === height) return prev;
      return { width, height };
    });
  }, []);

  const ref = useCallback(
    (node) => {
      // Disconnect from the previous node
      if (currentNodeRef.current) {
        observerCallbacks.delete(currentNodeRef.current);
        getSharedObserver().unobserve(currentNodeRef.current);
      }

      currentNodeRef.current = node;

      if (node) {
        // Read initial size synchronously via layout measurement
        measureNode(node);

        // Register this node's resize callback on the shared observer
        observerCallbacks.set(node, (entry) => {
          const { inlineSize: width, blockSize: height } =
            entry.contentBoxSize?.[0] ?? {};

          // Fall back to boundingClientRect for older browsers
          const w = width ?? entry.contentRect.width;
          const h = height ?? entry.contentRect.height;

          setSize((prev) => {
            if (prev.width === w && prev.height === h) return prev;
            return { width: w, height: h };
          });
        });

        getSharedObserver().observe(node);
      } else {
        // Node unmounted — reset size
        setSize({ width: undefined, height: undefined });
      }
    },
    [measureNode]
  );

  return { ref, width: size.width, height: size.height };
};

export default useResizeObserver;

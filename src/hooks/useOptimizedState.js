// src/hooks/useOptimizedState.js
import { useState, useCallback, useRef } from 'react';

// 防抖Hook
export const useDebounce = (callback, delay) => {
  const timeoutRef = useRef(null);

  const debouncedCallback = useCallback(
    (...args) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        callback(...args);
      }, delay);
    },
    [callback, delay]
  );

  return debouncedCallback;
};

// 节流Hook
export const useThrottle = (callback, delay) => {
  const lastRun = useRef(Date.now());

  const throttledCallback = useCallback(
    (...args) => {
      if (Date.now() - lastRun.current >= delay) {
        callback(...args);
        lastRun.current = Date.now();
      }
    },
    [callback, delay]
  );

  return throttledCallback;
};

// 优化的异步状态Hook
export const useAsyncState = (initialState) => {
  const [state, setState] = useState({
    data: initialState,
    loading: false,
    error: null,
  });

  const setAsyncState = useCallback(async (asyncFunction) => {
    setState((prev) => ({ ...prev, loading: true, error: null }));

    try {
      const result = await asyncFunction();
      setState({ data: result, loading: false, error: null });
      return result;
    } catch (error) {
      setState((prev) => ({ ...prev, loading: false, error }));
      throw error;
    }
  }, []);

  return [state, setAsyncState];
};

// 批量更新Hook
export const useBatchUpdate = () => {
  const [updates, setUpdates] = useState([]);
  const timeoutRef = useRef(null);

  const addUpdate = useCallback((updateFn) => {
    setUpdates((prev) => [...prev, updateFn]);

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      setUpdates((current) => {
        // 批量执行所有更新
        current.forEach((fn) => fn());
        return [];
      });
    }, 16); // 一帧的时间
  }, []);

  return addUpdate;
};

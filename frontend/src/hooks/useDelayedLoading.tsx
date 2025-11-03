import { useState, useEffect } from 'react';

export function useDelayedLoading(isLoading: boolean, showDelay = 500, hideDelay = 300) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    let showTimer: ReturnType<typeof setTimeout> | null = null;
    let hideTimer: ReturnType<typeof setTimeout> | null = null;

    if (isLoading) {
      showTimer = setTimeout(() => setShow(true), showDelay);
    } else {
      hideTimer = setTimeout(() => setShow(false), hideDelay);
    }

    return () => {
      if (showTimer) clearTimeout(showTimer);
      if (hideTimer) clearTimeout(hideTimer);
    };
  }, [isLoading, showDelay, hideDelay]);

  return show;
}

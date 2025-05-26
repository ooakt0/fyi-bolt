import { useEffect } from 'react';
import { useAuthStore } from '../store/authStore';

const INACTIVITY_LIMIT_MS = 2 * 60 * 60 * 1000; // 2 hours

export function useAutoLogoutOnInactivity() {
  const logout = useAuthStore((state) => state.logout);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    const resetTimer = () => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        logout();
        window.location.href = '/login';
      }, INACTIVITY_LIMIT_MS);
    };
    const events = ['mousemove', 'mousedown', 'keydown', 'scroll', 'touchstart'];
    events.forEach((event) => window.addEventListener(event, resetTimer));
    resetTimer();
    return () => {
      clearTimeout(timer);
      events.forEach((event) => window.removeEventListener(event, resetTimer));
    };
  }, [logout]);
}
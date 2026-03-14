/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState, useCallback } from 'react';
import { toast, ToastOptions } from 'react-toastify';
import { ViolationType } from '@/types/ViolationType';

interface AntiCheatingWindow extends Window {
  lastBlurTime?: number;
}

export const useAntiCheating = (onReturn?: () => void, reportViolation?: (type: ViolationType, metadata?: Record<string, unknown>) => void) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isFullscreenSupported, setIsFullscreenSupported] = useState(true);

  // Check if fullscreen is supported on mount
  useEffect(() => {
    const element = document.documentElement as any;
    const isSupported = !!(
      element.requestFullscreen ||
      element.webkitRequestFullscreen ||
      element.mozRequestFullScreen ||
      element.msRequestFullscreen
    );
    setIsFullscreenSupported(isSupported);
  }, []);

  const enterFullscreen = useCallback(async () => {
    try {
      const element = document.documentElement as any;
      if (element.requestFullscreen) {
        await element.requestFullscreen();
      } else if (element.webkitRequestFullscreen) {
        await element.webkitRequestFullscreen();
      } else if (element.mozRequestFullScreen) {
        await element.mozRequestFullScreen();
      } else if (element.msRequestFullscreen) {
        await element.msRequestFullscreen();
      } else {
        // Fallback for devices (like iOS Safari) that don't support element fullscreen
        setIsFullscreen(true);
      }
    } catch (error) {
      console.error("Error attempting to enable full-screen mode:", error);
      // Even if it fails, we might want to let the user proceed if we're on a problematic device
      setIsFullscreen(true);
      toast.warn("Full-screen mode could not be activated. Please ensure you stay on this page.");
    }
  }, []);

  const exitFullscreen = useCallback(async () => {
    try {
      const doc = document as any;
      if (doc.exitFullscreen) {
        await doc.exitFullscreen();
      } else if (doc.webkitExitFullscreen) {
        await doc.webkitExitFullscreen();
      } else if (doc.mozCancelFullScreen) {
        await doc.mozCancelFullScreen();
      } else if (doc.msExitFullscreen) {
        await doc.msExitFullscreen();
      }
    } catch (error) {
      console.error("Error attempting to exit full-screen mode:", error);
    }
  }, []);

  useEffect(() => {
    let wasInactive = false;
    const acWindow = window as AntiCheatingWindow;

    const getIsFullscreen = () => {
      const doc = document as any;
      return !!(
        doc.fullscreenElement ||
        doc.webkitFullscreenElement ||
        doc.mozFullScreenElement ||
        doc.msFullscreenElement
      );
    };

    const handleFullscreenChange = () => {
      const isCurrentlyFullscreen = getIsFullscreen();
      
      // Only update state if the API is supported
      if (isFullscreenSupported) {
        setIsFullscreen(isCurrentlyFullscreen);
      }

      if (!isCurrentlyFullscreen && isFullscreenSupported) {
        document.body.style.filter = "blur(15px)";
        toast.error("FULLSCREEN EXIT DETECTED: You must stay in fullscreen mode. This incident has been recorded.", {
          position: "top-center",
          autoClose: 10000,
        });
        if (reportViolation) {
          reportViolation('FULLSCREEN_EXIT');
        }
      } else {
        document.body.style.filter = "none";
      }
    };

    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      // Prevent PrintScreen
      if (e.key === 'PrintScreen') {
        try {
          if (navigator.clipboard && navigator.clipboard.writeText) {
             navigator.clipboard.writeText("").catch(() => {});
          }
        } catch (err) {
          console.error("Failed to clear clipboard", err);
        }
        toast.warn("Screenshots are not allowed during the exam.");
        if (reportViolation) {
          reportViolation('SCREENSHOT', { key: 'PrintScreen' });
        }
        e.preventDefault();
      }

      // Prevent common screenshot shortcuts (OS level, might not always work)
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 's' || e.key === 'S' || e.key === '4' || e.key === '3')) {
        toast.warn("Screenshots are not allowed during the exam.");
        if (reportViolation) {
          reportViolation('SCREENSHOT', { shortcut: 'OS_SHORTCUT' });
        }
        e.preventDefault();
      }

      // Prevent Copy/Paste/Cut shortcuts
      if ((e.ctrlKey || e.metaKey) && (e.key === 'c' || e.key === 'v' || e.key === 'x')) {
        e.preventDefault();
        toast.warn("Copying, cutting, and pasting are disabled during the exam.");
      }

      // Prevent DevTools (F12, Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+U)
      if (
        e.key === 'F12' ||
        ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'I' || e.key === 'J' || e.key === 'C')) ||
        ((e.ctrlKey || e.metaKey) && e.key === 'u')
      ) {
        e.preventDefault();
        toast.warn("Developer tools are disabled during the exam.");
      }
    };

    const handleCopy = (e: Event) => {
      e.preventDefault();
      toast.warn("Copying is disabled during the exam.");
    };

    const handlePaste = (e: Event) => {
      e.preventDefault();
      toast.warn("Pasting is disabled during the exam.");
    };

    const handleCut = (e: Event) => {
      e.preventDefault();
      toast.warn("Cutting is disabled during the exam.");
    };

    const handleInactive = () => {
      document.body.style.filter = "blur(15px)";
      wasInactive = true;
      acWindow.lastBlurTime = Date.now();
    };

    const handleActive = () => {
      const isCurrentlyFullscreen = getIsFullscreen();
      if (isCurrentlyFullscreen || !isFullscreenSupported) {
        document.body.style.filter = "none";
      }

      const now = Date.now();

      if (wasInactive) {
        const timeInactive = now - (acWindow.lastBlurTime || 0);

        if (timeInactive > 0 && timeInactive < 2000) {
          toast.error("SCREENSHOT DETECTED: Screen captures are strictly prohibited. This incident has been logged.", {
            position: "top-center",
            autoClose: 15000,
            // theme: "dark" as any,
          } as ToastOptions);
          if (reportViolation) {
            reportViolation('SCREENSHOT', { method: 'Blur_Sequence', duration_ms: timeInactive });
          }
        } else {
          toast.error("WARNING: You switched tabs/windows. This suspicious activity has been recorded.", {
            position: "top-center",
            autoClose: 10000,
          });
          if (reportViolation) {
            reportViolation('TAB_SWITCH', { duration_ms: timeInactive });
          }
        }

        try {
          if (navigator.clipboard && navigator.clipboard.writeText) {
             navigator.clipboard.writeText(" ");
          }
        } catch { }

        wasInactive = false;
        
        // Trigger the return callback if provided
        if (onReturn) {
          onReturn();
        }
      }
    };

    const handleVisibilityChange = () => {
      if (document.hidden) {
        handleInactive();
      } else {
        handleActive();
      }
    };

    const handleWindowBlur = () => {
      handleInactive();
    };

    const handleWindowFocus = () => {
      handleActive();
    };

    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length > 2) {
        toast.warn("Multi-finger gestures are restricted during the exam.");
      }
    };

    const handleResize = () => {
      if (window.innerHeight < 400 || window.innerWidth < 300) {
        toast.error("Please maximize your window. Split-screen or small windows are not allowed.");
      }
    };

    const handleSelectStart = (e: Event) => {
      e.preventDefault();
    };

    const style = document.createElement('style');
    style.id = 'anti-cheating-style';
    style.innerHTML = `
      @media print {
        body {
          display: none !important;
        }
      }
      *, *::before, *::after {
        -webkit-user-select: none !important;
        -moz-user-select: none !important;
        -ms-user-select: none !important;
        user-select: none !important;
        -webkit-touch-callout: none !important;
        -webkit-user-drag: none !important;
      }
      input, textarea {
        -webkit-user-select: text !important;
        -moz-user-select: text !important;
        -ms-user-select: text !important;
        user-select: text !important;
      }
    `;
    document.head.appendChild(style);

    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('copy', handleCopy);
    document.addEventListener('paste', handlePaste);
    document.addEventListener('cut', handleCut);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    document.addEventListener('touchstart', handleTouchStart, { passive: true });
    document.addEventListener('selectstart', handleSelectStart);
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('mozfullscreenchange', handleFullscreenChange);
    document.addEventListener('MSFullscreenChange', handleFullscreenChange);
    window.addEventListener('blur', handleWindowBlur);
    window.addEventListener('focus', handleWindowFocus);
    window.addEventListener('resize', handleResize);

    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('copy', handleCopy);
      document.removeEventListener('paste', handlePaste);
      document.removeEventListener('cut', handleCut);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('selectstart', handleSelectStart);
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
      document.removeEventListener('mozfullscreenchange', handleFullscreenChange);
      document.removeEventListener('MSFullscreenChange', handleFullscreenChange);
      window.removeEventListener('blur', handleWindowBlur);
      window.removeEventListener('focus', handleWindowFocus);
      window.removeEventListener('resize', handleResize);

      const addedStyle = document.getElementById('anti-cheating-style');
      if (addedStyle) {
        addedStyle.remove();
      }
      document.body.style.filter = "none";
    };
  }, [onReturn, isFullscreenSupported]);

  return { isFullscreen, enterFullscreen, exitFullscreen };
};

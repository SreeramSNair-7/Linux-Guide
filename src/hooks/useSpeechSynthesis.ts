// file: src/hooks/useSpeechSynthesis.ts
import { useState, useCallback } from 'react';

export interface UseSpeechSynthesisOptions {
  lang?: string;
  rate?: number;
  pitch?: number;
  volume?: number;
  onError?: (error: string) => void;
}

export function useSpeechSynthesis(options: UseSpeechSynthesisOptions = {}) {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isSupported, setIsSupported] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const speak = useCallback((text: string) => {
    if (!text || text.trim() === '') {
      return;
    }

    if (!('speechSynthesis' in window)) {
      setIsSupported(false);
      const msg = 'Speech Synthesis not supported';
      setError(msg);
      options.onError?.(msg);
      return;
    }

    try {
      // Cancel any ongoing speech
      window.speechSynthesis.cancel();
      setError(null);

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = options.lang || 'en-US';
      utterance.rate = options.rate || 1;
      utterance.pitch = options.pitch || 1;
      utterance.volume = Math.max(0, Math.min(1, options.volume || 1));

      utterance.onstart = () => {
        setIsSpeaking(true);
        setError(null);
      };
      utterance.onend = () => {
        setIsSpeaking(false);
      };
      utterance.onerror = (event) => {
        setIsSpeaking(false);
        const errorMsg = `Speech error: ${event.error}`;
        setError(errorMsg);
        console.error(errorMsg);
        options.onError?.(errorMsg);
      };

      window.speechSynthesis.speak(utterance);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Unknown error during speech synthesis';
      setError(errorMsg);
      setIsSpeaking(false);
      console.error(errorMsg);
      options.onError?.(errorMsg);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [options.lang, options.rate, options.pitch, options.volume, options.onError]);

  const stop = useCallback(() => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  }, []);

  const pause = useCallback(() => {
    if ('speechSynthesis' in window && window.speechSynthesis.speaking) {
      window.speechSynthesis.pause();
    }
  }, []);

  const resume = useCallback(() => {
    if ('speechSynthesis' in window && window.speechSynthesis.paused) {
      window.speechSynthesis.resume();
    }
  }, []);

  return {
    speak,
    stop,
    pause,
    resume,
    isSpeaking,
    isSupported,
    error,
  };
}

"use client";

import { useAuth } from "@/contexts/AuthProvider";
import { AuthService } from "@/services/auth.service";
import config from "../../../config";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import Script from "next/script";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import Spinner from "../ui/spinner/spinner";

type GoogleCredentialResponse = { credential: string };

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (options: {
            client_id: string;
            callback: (response: GoogleCredentialResponse) => void;
          }) => void;
          renderButton: (
            parent: HTMLElement,
            options: Record<string, string | number | boolean>,
          ) => void;
        };
      };
    };
  }
}

export default function GoogleSignInButton() {
  const { dispatch } = useAuth();
  const buttonRef = useRef<HTMLDivElement>(null);
  const [scriptReady, setScriptReady] = useState(false);
  const clientId = config.GOOGLE_CLIENT_ID;

  const { mutate, isPending } = useMutation({
    mutationFn: (credential: string) => AuthService.googleSignIn(credential),
    onSuccess: (response) => {
      dispatch({ type: "loginSuccess", payload: response });
      toast.success("Signed in with Google");
    },
    onError: (error: AxiosError<{ detail?: string }>) => {
      toast.error(error.response?.data?.detail || "Google sign-in failed");
    },
  });

  const onCredential = useCallback(
    (response: GoogleCredentialResponse) => {
      if (response.credential) mutate(response.credential);
    },
    [mutate],
  );

  useEffect(() => {
    if (!scriptReady || !clientId || !buttonRef.current || !window.google) return;

    window.google.accounts.id.initialize({
      client_id: clientId,
      callback: onCredential,
    });
    buttonRef.current.replaceChildren();
    window.google.accounts.id.renderButton(buttonRef.current, {
      theme: "outline",
      size: "large",
      shape: "rectangular",
      text: "continue_with",
      width: Math.min(352, buttonRef.current.clientWidth || 352),
      logo_alignment: "left",
    });
  }, [clientId, onCredential, scriptReady]);

  if (!clientId) return null;

  return (
    <div className="mt-5 flex min-h-10 w-full justify-center" aria-label="Sign in with Google">
      <Script
        src="https://accounts.google.com/gsi/client"
        strategy="afterInteractive"
        onReady={() => setScriptReady(true)}
        onError={() => toast.error("Google sign-in could not be loaded")}
      />
      <div className={isPending ? "pointer-events-none opacity-50" : ""}>
        <div ref={buttonRef} className="w-full" />
      </div>
      {isPending && (
        <div className="ml-3 self-center" aria-live="polite" aria-label="Signing in">
          <Spinner />
        </div>
      )}
    </div>
  );
}

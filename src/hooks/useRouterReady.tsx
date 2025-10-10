"use client"
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export const useRouterReady = () => {
  const [ready, setReady] = useState(false);
  const router = useRouter();
  useEffect(() => {
    setReady(true);
  }, [router]);
  return ready;
};

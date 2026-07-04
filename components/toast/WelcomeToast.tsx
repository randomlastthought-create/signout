"use client";

import { useEffect } from "react";
import { toast } from "@/components/toast/Toaster";

const SEEN_KEY = "signout_welcomed";

export default function WelcomeToast() {
  useEffect(() => {
    try {
      if (localStorage.getItem(SEEN_KEY)) return;
      localStorage.setItem(SEEN_KEY, "1");
    } catch {
      return;
    }
    const id = setTimeout(() => {
      toast.info("Made with love", "by Dara and Rex", 3000);
    }, 400);
    return () => clearTimeout(id);
  }, []);

  return null;
}

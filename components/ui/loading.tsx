"use client"

import { BiLoaderCircle } from "react-icons/bi";
import { useEffect } from "react";

export function Loading() {
  useEffect(() => {
    const originalError = console.error;
    console.error = (...args) => {
      if (typeof args[0] === "string" && args[0].includes("ResizeObserver loop")) {
        return;
      }
      originalError(...args);
    };

    return () => {
      console.error = originalError;
    };
  }, []);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-white/90 backdrop-blur-sm fade-in-animation"
      role="alert"
      aria-live="assertive"
    >
      <div className="flex flex-col items-center justify-center">
        <BiLoaderCircle className="h-10 w-10 animate-spin text-blue-500" />
        <p className="mt-4 text-sm text-gray-600">Loading...</p>
      </div>
    </div>
  );
}
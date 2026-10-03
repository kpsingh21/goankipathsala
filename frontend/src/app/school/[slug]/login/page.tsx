"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";

export default function SchoolLoginRedirect() {
  const params = useParams();
  const router = useRouter();
  const slug = params?.slug as string;

  useEffect(() => {
    if (slug) {
      router.replace(`/school/${slug}/portal/login`);
    }
  }, [slug, router]);

  return (
    <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center font-sans">
      <div className="flex flex-col items-center gap-3">
        <div className="h-8 w-8 border-3 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-xs text-slate-400 font-mono">Redirecting to institutional login portal...</p>
      </div>
    </div>
  );
}

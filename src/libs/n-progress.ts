"use client";

import { useLoading } from "@/contexts/loading-context";
import { usePathname } from "next/navigation";
import NProgress from "nprogress";
import "nprogress/nprogress.css";
import { useEffect } from "react";

NProgress.configure({ showSpinner: false, trickleSpeed: 200 });

export default function TopLoadingBar() {
  const pathname = usePathname();
  const { isLoading } = useLoading();

  useEffect(() => {
    NProgress.start();

    const timer = setTimeout(() => {
      NProgress.done();
    }, 300);

    return () => clearTimeout(timer);
  }, [pathname]);

  useEffect(() => {
    if (isLoading) {
      NProgress.start();
    } else {
      NProgress.done();
    }
  }, [isLoading]);

  return null;
}

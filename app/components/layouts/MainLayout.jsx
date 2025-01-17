"use client";

import Footer from "./Footer";
import HeaderComponent from "./Header";
import { useRouter, usePathname } from "next/navigation";
import { useMemo } from "react";

export default function MainLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();

  const isAuthPage = useMemo(
    () => pathname.includes("login") || pathname.includes("signup"),
    [pathname]
  );

  return (
    <div>
      {!isAuthPage && <HeaderComponent />}
      <main
        className={`md:min-h-[calc(100vh - 80px)] min-h-[calc(100vh - 100px)]`}
      >
        {children}
      </main>
      {!isAuthPage && <Footer />}
    </div>
  );
}

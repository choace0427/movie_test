"use client";

import Footer from "./Footer";
import HeaderComponent from "./Header";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useMemo } from "react";

// function checkTokenValidity() {
//   const token = localStorage.getItem("authToken");
//   const expirationTime = localStorage.getItem("authTokenExpiration");

//   if (!token || !expirationTime) {
//     return false;
//   }

//   const currentTime = new Date().getTime();
//   return currentTime < expirationTime;
// }

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
        className={`min-h-screen ${
          isAuthPage ? "" : "mt-5 min-h-[calc(100vh-210px)]"
        }`}
      >
        {children}
      </main>
      {!isAuthPage && <Footer />}
    </div>
  );
}

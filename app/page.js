"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const token = document.cookie
        .split("; ")
        .find((row) => row.startsWith("token="));
      if (token) {
        router.push("/films/list");
      } else {
        router.push("/auth/login");
      }
    }
  }, [router]);

  return <div>Loading...</div>;
}

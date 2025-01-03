"use client";

import { useState, useEffect } from "react";
import { Button, Avatar, Menu, Text, ActionIcon } from "@mantine/core";
import { IconLogout } from "@tabler/icons-react";
import { useRouter } from "next/navigation";

export default function HeaderComponent() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("userSession");
    if (!token) {
      router.replace("/auth/login");
    } else {
      setIsLoggedIn(true);
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("userSession");
    router.replace("/auth/login");
  };

  return (
    <header
      style={{
        height: "80px",
        padding: "14px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        backgroundColor: "#093545",
      }}
    >
      <Text fz={{ base: "24px", sm: "40px" }} weight={700} color="white">
        Movie Database
      </Text>
      {isLoggedIn && (
        <ActionIcon variant="transparent" color="white" onClick={handleLogout}>
          <IconLogout />
        </ActionIcon>
      )}
    </header>
  );
}

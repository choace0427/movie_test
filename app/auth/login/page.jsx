"use client";

import { useState } from "react";
import { TextInput, Button, Paper, Title, Text, Anchor } from "@mantine/core";
import { supabase } from "@/app/lib/supabaseClient";
import classes from "@/app/assets/css/AuthenticationImage.module.css";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      toast.error(error.message);
    } else {
      toast.success("successful login");
      localStorage.setItem("userSession", JSON.stringify(data));
      setTimeout(() => {
        router.replace("/films/list");
      }, 1000);
    }
    setLoading(false);
  };

  return (
    <div className={classes.wrapper}>
      <Paper className={classes.form} radius={0} p={30}>
        <Title order={2} className={classes.title} ta="center" mt="md" mb={50}>
          Login to Your Account
        </Title>

        <TextInput
          label="Email address"
          placeholder="hello@gmail.com"
          size="md"
          value={email}
          onChange={(event) => setEmail(event.currentTarget.value)}
          styles={{
            input: {
              backgroundColor: "#224957",
              color: "white",
              border: "#224957",
            },
            label: {
              color: "white",
            },
          }}
        />
        <TextInput
          label="Password"
          type="password"
          placeholder="Your password"
          mt="md"
          size="md"
          value={password}
          onChange={(event) => setPassword(event.currentTarget.value)}
          styles={{
            input: {
              backgroundColor: "#224957",
              color: "white",
              border: "#224957",
            },
            label: {
              color: "white",
            },
          }}
        />
        <Button
          fullWidth
          mt="xl"
          size="md"
          onClick={handleLogin}
          loading={loading}
          color="green"
        >
          Login
        </Button>

        {error && (
          <Text color="red" ta="center" mt="md">
            {error}
          </Text>
        )}

        <Text ta="center" mt="md" color="white">
          Don't have an account?{" "}
          <Anchor fw={700} onClick={() => router.push("signup")}>
            Sign Up
          </Anchor>
        </Text>
      </Paper>
    </div>
  );
}

"use client";

import { useState } from "react";
import { TextInput, Button, Paper, Title, Text, Anchor } from "@mantine/core";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { useForm } from "@mantine/form";
import classes from "@/app/assets/css/AuthenticationImage.module.css";

export default function LoginPage() {
  const router = useRouter();

  const form = useForm({
    mode: "uncontrolled",
    initialValues: {
      email: "",
      password: "",
    },
    validate: {
      email: (value) => (/^\S+@\S+$/.test(value) ? null : "Invalid email"),
      password: (value) =>
        value.length < 6 ? "Password must be at least 6 characters" : null,
    },
  });

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (values) => {
    setLoading(true);
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(values),
    });

    if (response.ok) {
      const data = await response.text();
      toast.success("successful login");
      if (typeof window !== "undefined") {
        localStorage.setItem("userSession", JSON.stringify(data));
      }
      setTimeout(() => {
        router.replace("/films/list");
      }, 1000);
    } else {
      const errorData = await response.text();
      toast.error(errorData.message);
      setError(errorData.message);
    }
    setLoading(false);
  };

  return (
    <div className={classes.wrapper}>
      <form onSubmit={form.onSubmit(handleLogin)}>
        <Paper className={classes.form} radius={0} p={30}>
          <Title
            order={2}
            className={classes.title}
            ta="center"
            mt="md"
            mb={50}
          >
            Login to Your Account
          </Title>
          <TextInput
            label="Email address"
            placeholder="hello@gmail.com"
            size="md"
            key={form.key("email")}
            {...form.getInputProps("email")}
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
            key={form.key("password")}
            {...form.getInputProps("password")}
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
            loading={loading}
            color="green"
            type="submit"
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
      </form>
    </div>
  );
}

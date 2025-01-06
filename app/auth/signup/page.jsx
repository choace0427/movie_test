"use client";

import { useState } from "react";
import {
  Anchor,
  Button,
  Checkbox,
  Paper,
  PasswordInput,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import { supabase } from "@/app/lib/supabaseClient";
import classes from "@/app/assets/css/AuthenticationImage.module.css";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { useForm } from "@mantine/form";

function Signup() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const form = useForm({
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

  const handleSignup = async (values) => {
    setLoading(true);
    setError(null);
    const { data, error } = await supabase.auth.signUp({
      email: values.email,
      password: values.password,
    });

    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Please confirm your email");
      const { error: insertError } = await supabase
        .from("users")
        .insert([{ user_id: data.user.id, email: data.user.email }]);

      if (insertError) {
        toast.error(insertError.message);
      } else {
        console.log("User added to users table");
      }
    }
    setLoading(false);
  };

  return (
    <div className={classes.wrapper}>
      <form onSubmit={form.onSubmit(handleSignup)}>
        <Paper className={classes.form} radius={0} p={30}>
          <Title
            order={2}
            className={classes.title}
            ta="center"
            mt="md"
            mb={50}
          >
            Create an Account
          </Title>

          <TextInput
            label="Email address"
            placeholder="hello@gmail.com"
            size="md"
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
          <PasswordInput
            label="Password"
            placeholder="Your password"
            mt="md"
            size="md"
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
            Sign Up
          </Button>

          {error && (
            <Text color="red" ta="center" mt="md">
              {error}
            </Text>
          )}

          <Text ta="center" mt="md" color="white">
            Already have an account?{" "}
            <Anchor color="green" fw={700} onClick={() => router.push("login")}>
              Login
            </Anchor>
          </Text>
        </Paper>
      </form>
    </div>
  );
}

export default Signup;

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

function Signup() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSignup = async () => {
    setLoading(true);
    setError(null);
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
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
      <Paper className={classes.form} radius={0} p={30}>
        <Title order={2} className={classes.title} ta="center" mt="md" mb={50}>
          Create an Account
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
        <PasswordInput
          label="Password"
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
          onClick={handleSignup}
          loading={loading}
          color="green"
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
    </div>
  );
}

export default Signup;

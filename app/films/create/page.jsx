"use client";

import React, { useState } from "react";
import {
  TextInput,
  NumberInput,
  Button,
  Group,
  Container,
  Title,
  Text,
  rem,
  Flex,
  Box,
  Textarea,
  Image,
} from "@mantine/core";
import { supabase } from "@/app/lib/supabaseClient";
import { authStore } from "@/app/_store/auth";
import { Dropzone, IMAGE_MIME_TYPE } from "@mantine/dropzone";
import { IconUpload, IconPhoto, IconX } from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { useForm } from "@mantine/form";

export default function FilmCreate() {
  const { user } = authStore();
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [publishYear, setPublishYear] = useState("");
  const [images, setImages] = useState(null);
  const [loading, setLoading] = useState(false);

  const form = useForm({
    initialValues: {
      title: "",
      publishYear: "",
      description: "",
    },
    validate: {
      publishYear: (value) =>
        value >= 1900 && value <= new Date().getFullYear()
          ? null
          : "Publish year must be between 1900 and the current year",
      title: (value) => (value.trim().length > 0 ? null : "Title is required"),
      description: (value) =>
        value.trim().length > 0 ? null : "Description is required",
    },
  });

  const handleSubmit = async (values) => {
    setLoading(true);
    const validationErrors = form.validate();
    if (validationErrors.hasErrors) {
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/films/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: values.title,
          publishYear: values.publishYear,
          posterImg: images,
          description: values.description,
          userId: user.id,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error);
      }

      toast.success(result.message);
      setTimeout(() => {
        router.push("list");
      }, 1000);
    } catch (error) {
      toast.error("Error submitting film data");
    }
    setLoading(false);
  };

  const handleCancel = () => {
    setTitle("");
    setDescription("");
    setPublishYear("");
    setImages(null);
    router.push("list");
  };

  const handleImageUpload = (files) => {
    const file = files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      setImages(reader.result);
    };
    reader.onerror = (error) => {
      console.error("Error converting image to base64:", error);
    };
  };

  return (
    <Container size="md" padding="md">
      <Title
        order={2}
        align={{ base: "start", sm: "center" }}
        mb="lg"
        className="text-white"
      >
        Create New Film
      </Title>
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Flex
          direction={{ base: "column-reverse", sm: "row" }}
          align={"start"}
          gap={{ base: 20, sm: 60 }}
        >
          <Box w={{ base: "100%", sm: "50%" }}>
            <Dropzone
              onDrop={handleImageUpload}
              onReject={(files) => console.log("rejected files", files)}
              maxSize={5 * 1024 ** 2}
              accept={IMAGE_MIME_TYPE}
              h={{ base: 400, sm: 440 }}
              styles={{
                root: {
                  backgroundColor: "#224957",
                  padding: "5px",
                },
                inner: {
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  height: "100%",
                  width: "100%",
                },
              }}
            >
              <Flex
                direction={"column"}
                justify="center"
                align={"center"}
                gap="md"
                mih={220}
                h={"100%"}
                w={"100%"}
                style={{ pointerEvents: "none" }}
              >
                {images ? (
                  <Image
                    src={images}
                    alt="Uploaded"
                    className="w-full sm:h-[420px] h-[380px]"
                  />
                ) : (
                  <>
                    <Dropzone.Accept>
                      <IconUpload
                        style={{
                          width: rem(52),
                          height: rem(52),
                          color: "var(--mantine-color-blue-6)",
                        }}
                        stroke={1.5}
                      />
                    </Dropzone.Accept>
                    <Dropzone.Reject>
                      <IconX
                        style={{
                          width: rem(52),
                          height: rem(52),
                          color: "var(--mantine-color-red-6)",
                        }}
                        stroke={1.5}
                      />
                    </Dropzone.Reject>
                    <Dropzone.Idle>
                      <IconPhoto
                        style={{
                          width: rem(52),
                          height: rem(52),
                          color: "var(--mantine-color-dimmed)",
                        }}
                        stroke={1.5}
                      />
                    </Dropzone.Idle>

                    <div>
                      <Text size="xl" inline color="white">
                        Upload an image here
                      </Text>
                    </div>
                  </>
                )}
              </Flex>
            </Dropzone>
          </Box>
          <Box w={{ base: "100%", sm: "50%" }}>
            <TextInput
              label="Title"
              placeholder="Enter film title"
              key={form.key("title")}
              {...form.getInputProps("title")}
              mb="md"
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
            <Textarea
              label="Description"
              placeholder="Enter film description"
              key={form.key("description")}
              {...form.getInputProps("description")}
              mb="md"
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                }
              }}
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
            <NumberInput
              label="Publish Year"
              placeholder="Enter publish year"
              mb="md"
              min={1900}
              key={form.key("publishYear")}
              {...form.getInputProps("publishYear")}
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
            <div className="sm:block hidden">
              <Flex gap={"md"} mt="lg">
                <Button
                  variant="outline"
                  onClick={handleCancel}
                  w={{ base: "100%", sm: 180 }}
                  styles={{
                    root: {
                      backgroundColor: "#093545",
                      color: "white",
                      borderColor: "white",
                    },
                  }}
                >
                  Cancel
                </Button>
                <Button
                  // onClick={handleSubmit}
                  type="submit"
                  color="green"
                  w={{ base: "100%", sm: 180 }}
                  loading={loading}
                >
                  Submit
                </Button>
              </Flex>
            </div>
          </Box>
        </Flex>
        <div className="sm:hidden block">
          <Flex gap={"md"} mt="lg">
            <Button
              variant="outline"
              onClick={handleCancel}
              w={{ base: "100%", sm: 180 }}
              styles={{
                root: {
                  backgroundColor: "#093545",
                  color: "white",
                  borderColor: "white",
                },
              }}
            >
              Cancel
            </Button>
            <Button
              // onClick={handleSubmit}
              type="submit"
              color="green"
              w={{ base: "100%", sm: 180 }}
            >
              Submit
            </Button>
          </Flex>
        </div>
      </form>
      {/* <FileInput
        label="Image Upload"
        placeholder="Upload film image"
        value={image}
        onChange={setImage}
        mb="md"
      /> */}
    </Container>
  );
}

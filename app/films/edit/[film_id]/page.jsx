"use client";

import React, { useState, useEffect } from "react";
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
} from "@mantine/core";
import { supabase } from "@/app/lib/supabaseClient";
import { authStore } from "@/app/_store/auth";
import { Dropzone, IMAGE_MIME_TYPE } from "@mantine/dropzone";
import { IconUpload, IconPhoto, IconX } from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

export default function FilmEdit({ params: { film_id } }) {
  const { user } = authStore();
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [publishYear, setPublishYear] = useState("");
  const [image, setImage] = useState(null);
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchFilmData = async () => {
      const { data, error } = await supabase
        .from("films")
        .select("*")
        .eq("film_id", film_id)
        .single();

      if (error) {
        console.error("Error fetching film data:", error);
      } else {
        setTitle(data.title);
        setPublishYear(data.publish_year);
        setImage(data.poster_img);
        setDescription(data.description);
      }
    };

    if (film_id) {
      fetchFilmData();
    }
  }, [film_id]);

  const handleUpdate = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("films")
        .update({
          title,
          publish_year: publishYear,
          poster_img: image,
          description: description,
        })
        .eq("film_id", film_id);

      if (error) {
        throw error;
      }
      toast.success("Film data updated successfully");
      setTimeout(() => {
        router.replace("/films/list");
      }, 1000);
    } catch (error) {
      toast.error("Error updating film data");
    }
    setLoading(false);
  };

  const handleCancel = () => {
    setTitle("");
    setPublishYear("");
    setImage(null);
    setDescription("");
    router.replace("/films/list");
  };

  const handleImageUpload = (files) => {
    const file = files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      setImage(reader.result);
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
        Edit Film
      </Title>
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
              w={"100%"}
              h={"100%"}
              style={{ pointerEvents: "none" }}
            >
              {image ? (
                <img
                  src={image}
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
            value={title}
            onChange={(event) => setTitle(event.currentTarget.value)}
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
          <NumberInput
            label="Publish Year"
            placeholder="Enter publish year"
            value={publishYear}
            onChange={(value) => setPublishYear(value)}
            mb="md"
            min={1900}
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
            value={description}
            onChange={(event) => setTitle(event.currentTarget.value)}
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
                onClick={handleUpdate}
                color="green"
                w={{ base: "100%", sm: 180 }}
                loading={loading}
              >
                Update
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
            onClick={handleUpdate}
            color="green"
            w={{ base: "100%", sm: 180 }}
          >
            Update
          </Button>
        </Flex>
      </div>
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

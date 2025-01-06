"use client";

import React, { useEffect, useState } from "react";
import {
  TextInput,
  Button,
  Pagination,
  List,
  Container,
  Table,
  Card,
  Group,
  Badge,
  ActionIcon,
  Image,
  Text,
  Grid,
  Flex,
  Title,
  Loader,
} from "@mantine/core";
import { supabase } from "@/app/lib/supabaseClient";
import { authStore } from "../../_store/auth";
import { useRouter } from "next/navigation";
import { IconHeart, IconPlus, IconX } from "@tabler/icons-react";

import classes from "@/app/assets/css/BadgeCard.module.css";

function SearchBar({ onSearch }) {
  const [query, setQuery] = useState("");

  const handleSearch = () => {
    onSearch(query);
  };

  return (
    <div>
      <TextInput
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search films..."
        w={{ xs: "100%", sm: "400px" }}
        onKeyDown={(event) => {
          if (event.key === "Enter") {
            handleSearch();
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
    </div>
  );
}

export default function FilmList() {
  const router = useRouter();
  const { user } = authStore((state) => state);

  const [films, setFilms] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(1);
  const filmsPerPage = 4;

  const fetchFilms = async (query = "", page = 1) => {
    if (user) {
      setLoading(true);

      const response = await fetch(
        `/api/films/list?query=${query}&page=${page}`
      );
      const { films, totalPages } = await response.json();

      if (response.ok) {
        setFilms(films);
        setTotalPages(totalPages);
      } else {
        console.error("Error fetching films:", films.error);
      }
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFilms("", currentPage);
  }, [currentPage]);

  const handleSearch = (query) => {
    fetchFilms(query, 1);
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    fetchFilms("", page);
  };

  return (
    <Container size="lg" px="md">
      <Flex
        align={"center"}
        justify={"space-between"}
        w={"100%"}
        gap="md"
        mb={20}
      >
        <SearchBar onSearch={handleSearch} />
        <Button
          onClick={() => {
            router.push("create");
          }}
          style={{ width: "100%", maxWidth: "200px" }}
          display={{ base: "none", sm: "block" }}
          color="green"
        >
          Add a new movie
        </Button>
        <ActionIcon
          size={"lg"}
          display={{ base: "block", sm: "none" }}
          color="green"
          onClick={() => {
            router.push("create");
          }}
        >
          <IconPlus size={"1.2rem"} />
        </ActionIcon>
      </Flex>
      {loading ? (
        <div className="h-[500px] flex flex-col items-center justify-center w-full">
          <Loader color="green" type="dots" />
        </div>
      ) : (
        <>
          {films.length === 0 ? (
            <div className="h-[500px] flex flex-col items-center justify-center w-full">
              <Title
                order={2}
                align={{ base: "start", sm: "center" }}
                mb="lg"
                className="text-white"
              >
                Your movie list is empty
              </Title>
            </div>
          ) : (
            <Grid gutter="md" mt={40}>
              {films.map((film) => (
                <Grid.Col span={{ base: 6, sm: 4, md: 3 }} key={film.id}>
                  <Card
                    radius="md"
                    p={{ base: 0, sm: "md" }}
                    className={`${classes.card} hover:scale-[1.05] hover:shadow-lg transition-transform duration-200 hover:cursor-pointer`}
                    bg={"#092C39"}
                    onClick={() => router.replace(`edit/${film.film_id}`)}
                  >
                    <Card.Section className="sm:h-[400px] h-[280px] overflow-hidden sm:p-1.5 p-0">
                      <Image
                        src={film.poster_img}
                        alt={film.title}
                        width="100%"
                        className="h-[400px]"
                      />
                    </Card.Section>

                    <Card.Section className={classes.section} mt="md">
                      <Group position="apart">
                        <Text fz="lg" fw={500} lineClamp={1} color="white">
                          {film.title}
                        </Text>
                      </Group>
                      <Text fz="sm" mt="xs" lineClamp={3} color="white">
                        {film.description}
                      </Text>
                      <Text fz="sm" mt="xs" color="white">
                        {film.publish_year}
                      </Text>
                    </Card.Section>
                  </Card>
                </Grid.Col>
              ))}
            </Grid>
          )}
          <Flex justify={"center"} mt={"sm"}>
            <Pagination
              value={currentPage}
              onChange={handlePageChange}
              total={totalPages}
              style={{ marginTop: "40px", textAlign: "center" }}
            />
          </Flex>
        </>
      )}
    </Container>
  );
}

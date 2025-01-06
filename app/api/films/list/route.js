import { supabase } from "@/app/lib/supabaseClient";

export async function GET(req) {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const queryParams = Object.fromEntries(url.searchParams.entries());

  const { query = "", page = 1, filmsPerPage = 4, userId } = queryParams;

  const pageNumber = parseInt(page, 10);
  if (isNaN(pageNumber) || pageNumber < 1) {
    return new Response(JSON.stringify({ error: "Invalid page number" }), {
      status: 400,
    });
  }

  const start = (pageNumber - 1) * filmsPerPage;
  const end = start + filmsPerPage - 1;

  const { data, error, count } = await supabase
    .from("films")
    .select("*", { count: "exact" })
    .eq("user_id", userId)
    .ilike("title", `%${query}%`)
    .order("film_id", { ascending: true })
    .range(start, end);

  if (error) {
    return new Response(JSON.stringify({ error: "Error fetching films" }), {
      status: 500,
    });
  }

  return new Response(
    JSON.stringify({
      films: data,
      totalPages: Math.ceil(count / filmsPerPage),
    }),
    { status: 200 }
  );
}

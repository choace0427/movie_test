import { supabase } from "@/app/lib/supabaseClient";

export default async function handler(req, res) {
  const { user } = req;
  const { query, page = 1, filmsPerPage = 4 } = req.query;

  if (!user) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const start = (page - 1) * filmsPerPage;
  const end = start + filmsPerPage - 1;

  const { data, error, count } = await supabase
    .from("films")
    .select("*", { count: "exact" })
    .eq("user_id", user.id)
    .ilike("title", `%${query}%`)
    .order("film_id", { ascending: true })
    .range(start, end);

  if (error) {
    return res.status(500).json({ error: "Error fetching films" });
  }

  res
    .status(200)
    .json({ films: data, totalPages: Math.ceil(count / filmsPerPage) });
}

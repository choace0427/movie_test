import { supabase } from "@/app/lib/supabaseClient";

// Function to handle GET requests for fetching film data
export async function GET(req, { params }) {
  const { film_id } = params;

  const { data, error } = await supabase
    .from("films")
    .select("*")
    .eq("film_id", film_id)
    .single();

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
    });
  }

  return new Response(JSON.stringify({ data }), { status: 200 });
}

// Function to handle PUT requests for updating film data
export async function PUT(req, { params }) {
  const { film_id } = params;
  const { title, publish_year, poster_img, description } = await req.json();

  const { data, error } = await supabase
    .from("films")
    .update({
      title,
      publish_year,
      poster_img,
      description,
    })
    .eq("film_id", film_id);

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
    });
  }

  return new Response(JSON.stringify({ data }), { status: 200 });
}

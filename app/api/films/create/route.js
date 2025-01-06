import { supabase } from "@/app/lib/supabaseClient";

export async function POST(req) {
  const { title, publishYear, posterImg, description, userId } =
    await req.json();

  try {
    const { data, error } = await supabase.from("films").insert([
      {
        title,
        publish_year: publishYear,
        poster_img: posterImg,
        description,
        user_id: userId,
      },
    ]);

    if (error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 400,
      });
    }

    return new Response(
      JSON.stringify({ message: "Film data created successfully", data }),
      { status: 200 }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: "Error submitting film data" }),
      {
        status: 500,
      }
    );
  }
}

export function OPTIONS(req, res) {
  res.setHeader("Allow", ["POST"]);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}

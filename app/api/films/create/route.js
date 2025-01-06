import { supabase } from "@/app/lib/supabaseClient";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { title, publishYear, posterImg, description, userId } = req.body;

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
        return res.status(400).json({ error: error.message });
      }

      return res
        .status(200)
        .json({ message: "Film data created successfully", data });
    } catch (error) {
      return res.status(500).json({ error: "Error submitting film data" });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

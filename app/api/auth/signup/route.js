import { supabase } from "@/app/lib/supabaseClient";

export async function POST(req) {
  const { email, password } = await req.json();

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
    });
  }

  const { error: insertError } = await supabase
    .from("users")
    .insert([{ user_id: data.user.id, email: data.user.email }]);

  if (insertError) {
    return new Response(JSON.stringify({ error: insertError.message }), {
      status: 400,
    });
  }

  return new Response(
    JSON.stringify({ message: "Please confirm your email" }),
    { status: 200 }
  );
}

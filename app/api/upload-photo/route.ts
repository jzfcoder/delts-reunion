import { cookies } from "next/headers";
import { supabase } from "@/lib/supabase";

const MAX_SIZE = 2 * 1024 * 1024; // 2MB

export async function POST(request: Request) {
  const cookieStore = await cookies();
  const token = cookieStore.get("session")?.value;

  if (!token) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data: attendee } = await supabase
    .from("attendees")
    .select("id")
    .eq("session_token", token)
    .single();

  if (!attendee) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const formData = await request.formData();
  const file = formData.get("file") as File | null;

  if (!file) {
    return Response.json({ error: "No file provided" }, { status: 400 });
  }

  if (file.size > MAX_SIZE) {
    return Response.json({ error: "File too large (max 2MB)" }, { status: 400 });
  }

  const buffer = await file.arrayBuffer();
  const base64 = Buffer.from(buffer).toString("base64");
  const dataUrl = `data:${file.type};base64,${base64}`;

  const { error } = await supabase
    .from("attendees")
    .update({ profile_pic_url: dataUrl })
    .eq("id", attendee.id);

  if (error) {
    return Response.json({ error: "Upload failed" }, { status: 500 });
  }

  return Response.json({ url: dataUrl });
}

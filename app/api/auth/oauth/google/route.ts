import { signIn } from "@/google-auth";

export async function GET() {
  return signIn("google", {
    redirectTo: "/api/auth/oauth/callback"
  });
}

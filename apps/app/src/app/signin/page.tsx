import { env } from "@/lib/env";

import { SignInForm } from "./SignInForm";

export default function SignInPage() {
  return <SignInForm googleEnabled={env.GOOGLE_AUTH_ENABLED} />;
}
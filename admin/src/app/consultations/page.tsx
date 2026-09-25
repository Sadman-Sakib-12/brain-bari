import { redirect } from "next/navigation";

export default function ConsultationsRedirectPage() {
  redirect("/requests?tab=consultations");
}

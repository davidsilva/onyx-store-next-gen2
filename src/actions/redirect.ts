"use server";

import { redirect } from "next/navigation";

export async function redirectToTarget(targetUrl: string) {
  redirect(targetUrl);
}

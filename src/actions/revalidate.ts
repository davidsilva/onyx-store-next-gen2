"use server";

import { revalidatePath } from "next/cache";

const clearCachesByServerAction = (path?: string) => {
  try {
    if (path) {
      revalidatePath(path);
    } else {
      revalidatePath("/");
    }
  } catch (error) {
    console.error(error);
  }
};
export default clearCachesByServerAction;

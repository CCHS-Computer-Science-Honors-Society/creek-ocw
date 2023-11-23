import { getAuth } from "@/server/auth";
import { createSafeActionClient } from "next-safe-action";

export const action = createSafeActionClient({
  async middleware() {
    const session = await getAuth();

    if (!session || !session.user) {
      throw new Error("Unauthorized");
    }

    return {
      user: session.user,
    };
  },
});

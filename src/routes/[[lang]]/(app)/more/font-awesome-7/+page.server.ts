import { redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";

/** Legacy pack slug → `/more/font-awesome` */
export const load: PageServerLoad = () => {
  redirect(301, "/more/font-awesome");
};

import { redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";

/** Legacy pack icon URLs → `/more/font-awesome/icon/...` */
export const load: PageServerLoad = ({ params }) => {
  redirect(301, `/more/font-awesome/icon/${params.id}`);
};

import { currentUser } from "@/firebaseConfig";

export default async (to: any, from: any, next: any) => {
  //* should await until current user is fetched from state.
  if (await currentUser()) {
    next();
  } else {
    next("/signin");
  }
};

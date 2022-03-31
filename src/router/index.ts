import { createRouter, createWebHistory } from "vue-router";
import Home from "@/views/Home.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: Home,
      meta: { layout: "main" },
    },
    {
      path: "/tv",
      name: "tv",
      component: () => {
        return import("@/views/TV.vue");
      },
      meta: { layout: "main" },
    },
    {
      path: "/film",
      name: "film",
      component: () => {
        return import("@/views/Film.vue");
      },
      meta: { layout: "main" },
    },
    {
      path: "/account",
      name: "account",
      component: () => {
        return import("@/views/Account.vue");
      },
      meta: { layout: "main" },
    },
    {
      path: "/media/:media_type/:slug",
      name: "media",
      //* lazy loading the component.
      component: () => {
        return import("@/views/Media.vue");
      },
      meta: { layout: "main" },
    },
  ],
});

export default router;

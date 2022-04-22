import { createRouter, createWebHistory } from "vue-router";
import Home from "@/views/Home.vue";
import AuthGuard from "./authGaurd";

const router = createRouter({
  scrollBehavior(to, from, savedPosition) {
    return { top: 0 };
  },
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
      path: "/movie",
      name: "movie",
      component: () => {
        return import("@/views/Film.vue");
      },
      meta: { layout: "main" },
    },
    {
      path: "/signin",
      name: "signin",
      component: () => {
        return import("@/views/SignIn.vue");
      },
      meta: { layout: "main", transition: "fade" },
    },
    {
      path: "/signup",
      name: "signup",
      component: () => {
        return import("@/views/SignUp.vue");
      },
      meta: { layout: "main", transition: "fade" },
    },
    {
      path: "/profile",
      name: "profile",
      component: () => {
        return import("@/views/Profile.vue");
      },
      meta: { layout: "main" },
      beforeEnter: AuthGuard,
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
    {
      path: "/search/:search_input",
      name: "search-results",
      component: () => {
        return import("@/views/SearchResults.vue");
      },
      meta: { layout: "main" },
    },
    {
      path: "/mywatchlist",
      name: "my-watchlist",
      component: () => {
        return import("@/views/MyWatchlist.vue");
      },
      meta: { layout: "main" },
      beforeEnter: AuthGuard,
    },
    {
      path: "/myreviews",
      name: "my-reviews",
      component: () => {
        return import("@/views/MyReviews.vue");
      },
      meta: { layout: "main" },
      beforeEnter: AuthGuard,
    },
    {
      path: "/myratings",
      name: "my-ratings",
      component: () => {
        return import("@/views/MyRatings.vue");
      },
      meta: { layout: "main" },
      beforeEnter: AuthGuard,
    },
  ],
});

export default router;

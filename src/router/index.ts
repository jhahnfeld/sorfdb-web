import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
  linkActiveClass: "active",
  linkExactActiveClass: "exact-active",
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: () => import("../views/HomeView.vue"),
    },
    {
      path: "/search",
      name: "search",
      component: () => import("../views/search/SearchView.vue"),
    },
    {
      path: "/search/:tab",
      name: "search-tab",
      component: () => import("../views/search/SearchView.vue"),
    },
    {
      path: "/browse",
      name: "browse",
      component: () => import("../views/browse/BrowseView.vue"),
    },
    {
      path: "/browse/:tab",
      name: "browse-tab",
      component: () => import("../views/browse/BrowseView.vue"),
    },
    {
      path: "/download",
      name: "download",
      component: () => import("../views/DownloadView.vue"),
    },
    {
      path: "/documentation",
      name: "documentation",
      component: () => import("../views/DokuView.vue"),
    },
    {
      path: "/faq",
      name: "faq",
      component: () => import("../views/FaqView.vue"),
    },
    {
      path: "/about",
      name: "about",
      component: () => import("../views/AboutView.vue"),
    },
    {
      path: "/imprint",
      name: "imprint",
      component: () => import("../views/ImprintView.vue"),
    },
    {
      path: "/result/:id",
      name: "result",
      component: () => import("../views/show-results/ResultView.vue"),
      props: true,
    },
    {
      path: "/composition",
      name: "composition",
      component: () => import("../views/DatasetCompositionView.vue"),
    },
    {
      path: "/:catchAll(.*)",
      name: "Lost",
      component: () => import("../views/NotFoundView.vue"),
    },
  ],
});

export default router;

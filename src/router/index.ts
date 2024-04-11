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
      path: "/search/sequence",
      name: "search-sequence",
      component: () => import("../views/search/SearchSequencesView.vue"),
    },
    {
      path: "/search/family",
      name: "search-family",
      component: () => import("../views/search/SearchFamiliesView.vue"),
    },
    {
      path: "/browse/sequence",
      name: "browse-sequence",
      component: () => import("../views/browse/BrowseSequencesView.vue"),
    },
    {
      path: "/browse/family",
      name: "browse-family",
      component: () => import("../views/browse/BrowseFamiliesView.vue"),
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

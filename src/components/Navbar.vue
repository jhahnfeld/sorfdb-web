<script setup lang="ts">
import { ref } from "vue";
const items = ref([
  { href: { name: "home" }, text: "Home" },
  { href: { name: "search" }, text: "Search" },
  { href: { name: "browse" }, text: "Browse" },
  { href: { name: "download" }, text: "Download" },
  { href: { name: "documentation" }, text: "Documentation" },
  { href: { name: "faq" }, text: "FAQ" },
  { href: { name: "about" }, text: "About" },
]);
</script>

<template>
  <nav
    class="navbar navbar-expand-lg navbar-light fixed-top bg-light navbar-scroll"
  >
    <div class="container-fluid">
      <router-link class="navbar-brand" to="/" style="font-weight: bold;">sORFdb</router-link>
      <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarSupportedContent"
        aria-controls="navbarSupportedContent"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarSupportedContent">
        <ul class="navbar-nav me-auto mb-2 mb-lg-0">
          <template v-for="{ href, text } in items" :key="href">
            <li>
              <router-link class="nav-link" :to="href">{{ text }}</router-link>
            </li>
          </template>
        </ul>
        <ul class="navbar-nav">
          <li>
            <a
              style="font-size: 2em"
              class="nav-link"
              href="https://github.com/jhahnfeld/sorfdb-web"
              target="_blank"
              ><i class="bi bi-github text-dark"></i
            ></a>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<style></style>

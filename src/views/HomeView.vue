<script setup lang="ts"></script>

<template>
  <main class="container pt-5">
    <div>
      <h1 style="text-align: left; font-weight: bold">
        sORFdb
        <span
          class="float-end version"
          style="font-size: 0.3em; color: gray; padding-right: 1.5em"
        >
          (DB: v1.0)
        </span>
      </h1>
      <h3 style="text-align: left; color: gray">
        A database for small proteins &amp; sORFs in bacteria
      </h3>
    </div>

    <div class="container-fluid" style="margin-top: 2em">
      <div class="row">
        <div class="col-xs-12 col-md-4"></div>
        <div class="col-xs-12 col-md-4">
          <h2 style="text-align: center; margin-top: 1em">Search</h2>
        </div>
        <div class="col-xs-12 col-md-4">
          <h2 style="text-align: center; margin-top: 1em">Browse</h2>
        </div>
      </div>
      <div class="row">
        <div class="col-xs-12 col-md-4 mt-2 mb-2">
          <h2 style="text-align: center; margin-top: 1em">Sequences</h2>
        </div>
        <div class="col-xs-12 col-md-4 mt-2 mb-2 text-center">
          <router-link
            to="/search/sequence"
            style="color: black; text-decoration: none"
          >
            <img src="@/assets/images/Search_1.svg" />
          </router-link>
        </div>
        <div class="col-xs-12 col-md-4 mt-2 mb-2 text-center">
          <router-link
            to="/browse/sequence"
            style="color: black; text-decoration: none"
          >
            <img src="@/assets/images/Browse_1.svg" />
          </router-link>
        </div>
      </div>
      <div class="row">
        <div class="col-xs-12 mt-3 col-md-4 mt-2 mb">
          <h2 style="text-align: center; margin-top: 1em">Families</h2>
        </div>
        <div class="col-xs-12 col-md-4 mt-2 mb-2 text-center">
          <router-link
            to="/search/family"
            style="color: black; text-decoration: none"
          >
            <img src="@/assets/images/Search_2.svg" />
          </router-link>
        </div>
        <div class="col-xs-12 col-md-4 mt-2 mb-2 text-center">
          <router-link
            to="/browse/family"
            style="color: black; text-decoration: none"
          >
            <img src="@/assets/images/Browse_2.svg" />
          </router-link>
        </div>
      </div>
    </div>
    <!--
    <div class="container-fluid" style="margin-top: 2em">
      <div class="row">
        <div class="col-xs-12 col-md-6 text-center">
          <button type="button" class="btn btn-primary">
            <router-link
              to="/search/sequence"
              style="color: white; text-decoration: none"
            >
              <h2>Search Sequences</h2>
            </router-link>
          </button>
        </div>
        <div class="col-xs-12 col-md-6 text-center">
          <button type="button" class="btn btn-primary">
            <router-link
              to="/browse/sequence"
              style="color: white; text-decoration: none"
            >
              <h2>Browse Sequences</h2>
            </router-link>
          </button>
        </div>
      </div>
      <div class="row">
        <div class="col-xs-12 col-md-6 mt-3 text-center">
          <button type="button" class="btn btn-primary">
            <router-link
              to="/search/family"
              style="color: white; text-decoration: none"
            >
              <h2>Search Families</h2>
            </router-link>
          </button>
        </div>
        <div class="col-xs-12 col-md-6 mt-3 text-center">
          <button type="button" class="btn btn-primary">
            <router-link
              to="/browse/family"
              style="color: white; text-decoration: none"
            >
              <h2>Browse Families</h2>
            </router-link>
          </button>
        </div>
      </div>
    </div>
    -->
    <h3 style="margin-top: 3em">About sORFdb</h3>
    <p style="text-align: justify">
      sORFdb is a dedicated database for short open reading frames (sORFs) and
      small proteins as well as their functions in bacteria of different taxa.
      Small proteins with fewer than 100 and, in particular, fewer than 50 amino
      acids are still largely unexplored. Nonetheless, they represent an
      important part of the genetic repertoire of bacteria that often remains
      neglected.
      <br />
      To address this issue, sORFdb has been developed. It combines high quality
      information from genome and protein databases, enriching them with
      additional information such as physicochemical properties and the presence
      of ribosomal binding sites. Additionally, hidden Markov models for novel
      identified small protein families are provided, which can be used for the
      computational prediction of small proteins. sORFdb aims to provide
      comprehensive high quality data for sORFs and small proteins and to
      improve the findability of small proteins and their functions in bacteria,
      thus supporting their future consistent identification and annotation.
      <br />
      Read more about sORFdb here: <router-link to="/about">About</router-link>
    </p>
    <h3>Usage</h3>
    <p style="text-align: justify">
      To access the database an instant search and a BLAST search for sORFs and
      small protein sequences is available. The browse function provides a
      viewer for all database entries. The entries can be filtered using
      criteria such as taxonomy, sequence length and physicochemical properties.
      <br />
      If you want to know more about the usage of the search and browse
      functions look here:
      <router-link to="/documentation">Documentation</router-link><br />
      Some of your questions might also be answered in the
      <router-link to="/faq">FAQ</router-link>.
    </p>
    <h5>Citation</h5>
    <p>If you use sORFdb in your research, please cite this paper:</p>
    <pre>
      Hahnfeld, J.M., Schwengers, O., Jelonek, L. et al. sORFdb – a database for
      sORFs, small proteins, and small protein families in bacteria. BMC
      Genomics 26, 110 (2025). <a href="https://doi.org/10.1186/s12864-025-11301-w"> 10.1186/s12864-025-11301-w </a>
    </pre>
  </main>
</template>

<style></style>

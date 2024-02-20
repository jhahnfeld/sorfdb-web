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
          (DB: v0.1)
        </span>
      </h1>
      <h3 style="text-align: left; color: gray">
        A database for small proteins &amp; sORFs in bacteria
      </h3>
    </div>

    <div class="container-fluid">
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
        <div class="col-xs-12 col-md-4">
          <h2 style="text-align: center; margin-top: 1em">
            sORF & small protein sequences
          </h2>
        </div>
        <div class="col-xs-12 col-md-4">
          <h2 style="text-align: center; margin-top: 1em">
            <router-link
              to="/search"
              style="color: black; text-decoration: none"
            >
              Icon1
            </router-link>
          </h2>
        </div>
        <div class="col-xs-12 col-md-4">
          <h2 style="text-align: center; margin-top: 1em">
            <router-link
              to="/browse"
              style="color: black; text-decoration: none"
            >
              Icon2
            </router-link>
          </h2>
        </div>
      </div>
      <div class="row">
        <div class="col-xs-12 col-md-4">
          <h2 style="text-align: center; margin-top: 1em">
            Small protein families
          </h2>
        </div>
        <div class="col-xs-12 col-md-4">
          <h2 style="text-align: center; margin-top: 1em">
            <router-link
              to="/search"
              style="color: black; text-decoration: none"
            >
              Icon3
            </router-link>
          </h2>
        </div>
        <div class="col-xs-12 col-md-4">
          <h2 style="text-align: center; margin-top: 1em">
            <router-link
              to="/browse"
              style="color: black; text-decoration: none"
            >
              Icon4
            </router-link>
          </h2>
        </div>
      </div>
    </div>
    <!--
    <div class="row">
      <div class="col">
        <h2 style="text-align: center; margin-top: 1em">
          <router-link to="/search" style="color: black; text-decoration: none">
            Search
          </router-link>
        </h2>
        <h4 style="text-align: center">
          <router-link to="/search" style="color: gray; text-decoration: none">
            for small proteins & sORFs
          </router-link>
        </h4>
      </div>
      <div class="col">
        <h2 style="text-align: center; margin-top: 1em">
          <router-link to="/browse" style="color: black; text-decoration: none">
            Browse
          </router-link>
        </h2>
        <h4 style="text-align: center">
          <router-link to="/browse" style="color: gray; text-decoration: none">
            the database
          </router-link>
        </h4>
      </div>
      <div class="col">
        <h2 style="text-align: center; margin-top: 1em">
          <router-link
            to="/download"
            style="color: black; text-decoration: none"
          >
            Download
          </router-link>
        </h2>
        <h4 style="text-align: center">
          <router-link
            to="/download"
            style="color: gray; text-decoration: none"
          >
            small protein groups, protein & nucleotide sequences, ...
          </router-link>
        </h4>
      </div>
    </div>
    -->

    <h3 style="margin-top: 2em">About sORFdb</h3>
    <p style="text-align: justify">
      sORFdb is a the first dedicated database for small open reading frames
      (sORFs) and small proteins as well as their functions in bacteria of
      different taxa. Small proteins with fewer than 100 and, in particular,
      fewer than 50 amino acids are still largely unexplored. Nonetheless, they
      represent an important part of the genetic repertoire of bacteria that
      often remains neglected.
      <br />
      To address this issue, sORFdb has been developed. It combines high quality
      information from genome and protein databases, enriching them with
      additional information such as protein descriptors and the presence of
      ribosomal binding sites. Additionally, hidden Markov models for novel
      identified small protein families are provided, which can be used for the
      computational prediction of small proteins. sORFdb aims to provide
      comprehensive high quality data for sORFs and small proteins and to
      improve the findability of small proteins and their functions in bacteria,
      thus supporting their future consistent identification and annotation.
      <br />
      Read more about sORFdb here: <router-link to="/about">About</router-link>
    </p>
    <h4>Usage</h4>
    <p style="text-align: justify">
      To access the database an instant search and a BLAST search for sORFs and
      small protein sequences is available. The browse function provides a
      viewer for all database entries. The entries can be filtered using
      criteria such as taxonomy, sequence length and protein descriptors.
      <br />
      If you want to know more about the usage of the search and browse
      functions look here: <router-link to="/about">Documentation</router-link
      ><br />
      Some of your questions might also be answered in the
      <router-link to="/about">FAQ</router-link>.
    </p>
  </main>
</template>

<style></style>

<script setup lang="ts"></script>

<template>
  <div class="page-body flex-grow-1 ">
    <div class="container">
      <h2>Documentation</h2>
      <h3>Search  <router-link to="/search">&#128279;</router-link></h3>
        The search function of sORFdb can be used to search for sORF and small protein sequences in the database, as well as 
        for the search for entry IDs to look up one ore more entries directly.
        There are two search types available:
        <h4>Fast search</h4>
        The fast search performs an instant exact search for the given sORF or small protein sequences.
        This means that only entries which are completely identical are reported.
        <h4>BLAST search</h4>
        The BLAST search performs a BLAST-based sequence similarity search optimized for sORF and small proteins.
        This allows the detection of more distant homolgous sequences in the database for the given queries.
      <h3>Browse  <router-link to="/browse">&#128279;</router-link></h3>
      The search function allows users to view the contents of the database and filter them according to various criteria.
      The view of the database can be customized to include only user-defined fields to improve clarity and readability.
      To search sORFs and small proteins of interest, the user can specify a set of features that must be met for an entry to be displayed.
      For example, the view can be restricted to show only small proteins up to 50 amino acids in length that have a ribosomal binding site.
      The different feature fields can be freely combined.
      All entries of a browse and search result can be exported and downloaded as TSV file. 
      <h3>Downloads  <router-link to="/download">&#128279;</router-link></h3>
        In the download section, users can download all data of sORFdb for local use.
        Sequence data of sORFs and small proteins are provided as compressed FASTA files.
        Information about the cluster membership of small proteins is available in a TSV file.
        The hidden Markov models of the new small protein families are provided as a compressed ASCII file that can be used for searching with <a href="http://hmmer.org/">HMMER</a>.
        The complete database with all fields, from taxonomy to protein descriptors, can be downloaded as a TSV file for local user-specific processing.
    </div>
  </div>
</template>

<style></style>


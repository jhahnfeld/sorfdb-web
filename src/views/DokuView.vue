<script setup lang="ts"></script>

<template>
  <div class="page-body flex-grow-1">
    <div class="container">
      <h2 style="margin-top: 0.5em">Documentation</h2>
      <h3>Search <router-link to="/search/sequence">&#128279;</router-link></h3>
      The search function of sORFdb can be used to search for sORF and small
      protein sequences in the database, as well as for entry IDs to look up one
      or more entries directly. There are two types of sequence search and a
      small protein family search available:
      <h4 style="margin-top: 0.5em">Exact search</h4>
      The fast search performs an instant exact search for the given sORF or
      small protein sequences. This means that only entries which are completely
      identical will be reported.
      <h4 style="margin-top: 0.5em">BLAST search</h4>
      The BLAST search performs a BLAST-based sequence similarity search
      optimized for sORF and small proteins. This allows the detection of more
      distant homologs in the database for the given queries. The identity and
      coverage thresholds can be set by the user.
      <h4 style="margin-top: 0.5em">HMM based small protein family search</h4>
      The search for small protein families is based on Hidden Markov Models
      (HMMs), which are built from clusters of non-redundant small proteins with
      up to 50 amino acids. The search is performed using hmmscan from the HMMER
      suite.
      <h3 style="margin-top: 0.5em">
        Browse <router-link to="/browse/sequence">&#128279;</router-link>
      </h3>
      The Browse function allows users to view the contents of the database and
      filter it according to various criteria. The view of the database can be
      customized to include only user-defined fields to improve readability. To
      search for sORFs and small proteins of interest, the user can specify a
      set of features that must be met for an entry to be displayed. For
      example, the view can be restricted to show only small proteins up to 50
      amino acids in length that have a ribosomal binding site. The different
      feature fields can be freely combined. All entries of a browse and search
      result can be exported and downloaded as a TSV file. <br />
      Similarly, small protein families can be explored and filtered.
      <h3 style="margin-top: 0.5em">
        Downloads <router-link to="/download">&#128279;</router-link>
      </h3>
      In the download section, users can download all data from sORFdb for local
      use. Sequence data of sORFs and small proteins are provided as compressed
      FASTA files. Family membership information for small proteins is available
      as a TSV file. The Hidden Markov Models of the new small protein families
      are provided as a compressed ASCII file that can be used for
      <a href="http://hmmer.org/">HMMER</a> searches. The complete database with
      all fields from taxonomy to protein descriptors can be downloaded as a TSV
      file for local custom processing.
    </div>
  </div>
</template>

<style></style>

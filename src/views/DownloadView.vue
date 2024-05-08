<script setup lang="ts"></script>

<template>
  <div class="page-body flex-grow-1">
    <div class="container">
      <h2>Download</h2>
      <h5>
        All data are available for download via
        <a href="https://doi.org/10.5281/zenodo.10688271">Zenodo</a>
        <span style="display: inline-block; width: 10px"></span>

        <a href="https://doi.org/10.5281/zenodo.10688271"
          ><img
            src="https://zenodo.org/badge/DOI/10.5281/zenodo.10688271.svg"
            alt="DOI"
        /></a>
      </h5>

      <p>Direct download:</p>
      <ul>
        <li>
          <a
            href="https://zenodo.org/records/10688271/files/sorfdb.tsv.gz?download=1"
            ><b>sorfdb.tsv.gz</b></a
          >
          : sORFdb database
        </li>
        <li>
          <a
            href="https://zenodo.org/records/10688271/files/sorfdb.faa.gz?download=1"
            ><b>sorfdb.faa.gz</b></a
          >
          : Small proteins
        </li>
        <li>
          <a
            href="https://zenodo.org/records/10688271/files/sorfdb.fna.gz?download=1"
            ><b>sorfdb.fna.gz</b></a
          >
          : sORFs
        </li>
        <li>
          <a
            href="https://zenodo.org/records/10688271/files/sorfdb.families.tsv.gz?download=1"
            ><b>sorfdb.families.tsv.gz</b></a
          >
          : Small protein families
        </li>
        <li>
          <a
            href="https://zenodo.org/records/10688271/files/sorfdb.hmm.gz?download=1"
            ><b>sorfdb.hmm.gz</b></a
          >
          : ASCII HMM file (HMMER3/f 3.4)
        </li>
      </ul>
    </div>
  </div>
</template>

<style></style>

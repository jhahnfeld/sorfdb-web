<script setup lang="ts"></script>

<template>
  <div class="page-body flex-grow-1 container">
    <h2>FAQ</h2>
    If you have a question you can ask it at
    <a href="https://github.com/jhahnfeld/sorfdb-web" target="_blank">GitHub</a>
    or send a mail to
    <a href="mailto:sorfdb@computational.bio.uni-giessen.de"
      >sorfdb@computational.bio.uni-giessen.de</a
    >.
    <div
      style="margin-top: 1em"
      class="accordion accordion-flush"
      id="accordionExample"
    >
      <div class="accordion-item">
        <h2 class="accordion-header" id="headingOne">
          <button
            class="accordion-button"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#collapseOne"
            aria-expanded="true"
            aria-controls="collapseOne"
          >
            1. Why should I use sORFdb?
          </button>
        </h2>
        <div
          id="collapseOne"
          class="accordion-collapse collapse show"
          aria-labelledby="headingOne"
          data-bs-parent="#accordionExample"
        >
          <div class="accordion-body">
            If you are looking for a sORF or small protein database for bacteria
            you will find in sORFdb a comprehensive, taxonomy independent and
            quality-filtered source for sequence data, functional descriptions
            and protein properies. It offers specialized web-based search and
            browse functions as well as downloadable sequence and small protein
            family data for local use.
          </div>
        </div>
      </div>
      <div class="accordion-item">
        <h2 class="accordion-header" id="headingTwo">
          <button
            class="accordion-button collapsed"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#collapseTwo"
            aria-expanded="false"
            aria-controls="collapseTwo"
          >
            2. I cannot find my protein using the search function. What should I
            do?
          </button>
        </h2>
        <div
          id="collapseTwo"
          class="accordion-collapse collapse"
          aria-labelledby="headingTwo"
          data-bs-parent="#accordionExample"
        >
          <div class="accordion-body">
            If you cannot find your protein with the exact search, you can use
            the BLAST based search which allows you to specify identity and
            coverage thresholds. Alternatively, you can use the HMM based small
            protein family search. If all searches fail to find your protein, it
            is likely that there are no homologs in the current version of the
            database.
          </div>
        </div>
      </div>
      <div class="accordion-item">
        <h2 class="accordion-header" id="headingThree">
          <button
            class="accordion-button collapsed"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#collapseThree"
            aria-expanded="false"
            aria-controls="collapseThree"
          >
            3. How can I use the database to predict sORFs and small proteins in
            my assembled genome?
          </button>
        </h2>
        <div
          id="collapseThree"
          class="accordion-collapse collapse"
          aria-labelledby="headingThree"
          data-bs-parent="#accordionExample"
          Three
        >
          <div class="accordion-body">
            You can use the HMMs of the small protein families to identify small
            proteins or you can use the sequence data for a sequence search,
            e.g. with BLAST.
          </div>
        </div>
      </div>
      <div class="accordion-item">
        <h2 class="accordion-header" id="headingFour">
          <button
            class="accordion-button collapsed"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#collapseFour"
            aria-expanded="false"
            aria-controls="collapseFour"
          >
            4. What are the recommended BLAST parameters for a local search?
          </button>
        </h2>
        <div
          id="collapseFour"
          class="accordion-collapse collapse"
          aria-labelledby="headingFour"
          data-bs-parent="#accordionExample"
        >
          <div class="accordion-body">
            BLASTN:
            <p style="monospace">
              -task blastn-short -soft_masking false -evalue 1
            </p>
            BLASTP:
            <p style="monospace">
              -task blastp-short -matrix BLOSUM62 -comp_based_stats 0
              -soft_masking false -seg no -evalue 1
            </p>
            BLASTX:
            <p style="monospace">
              -word_size 2 -gapopen 9 -gapextend 1 -threshold 16 -window_size 15
              -matrix BLOSUM62 -comp_based_stats 0 -soft_masking false -seg no
              -evalue 1
            </p>
            TBLASTX:
            <p style="monospace">
              -word_size 2 -matrix BLOSUM62 -comp_based_stats 0 -soft_masking
              false -seg no -evalue 1
            </p>
            TBLASTN:
            <p style="monospace">
              -word_size 2 -matrix BLOSUM62 -comp_based_stats 0 -soft_masking
              false -seg no -evalue 1
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style></style>

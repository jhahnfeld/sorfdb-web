<script setup lang="ts">
import type { SorfdbEntry } from "@/model/SorfdbSearchResult";
import type { PropType } from "vue";
const props = defineProps({
  id: { type: String },
  entry: { type: Object as PropType<SorfdbEntry>, required: true },
});
</script>

<template>
  <table>
    <tbody>
      <tr>
        <th class="text-end">Gravy:</th>
        <td class="ps-5">
          {{ entry.gravy }}
          <i
            class="bi bi-question-circle"
            data-toggle="tooltip"
            data-placement="right"
            title="Gravy (hydrophobicity) according to Kyte and Doolittle (1982).&#013;The hydrophobicity is an important stabilization force in protein folding; this force changes depending on the solvent in which the protein is found."
          ></i>
        </td>
      </tr>
      <tr>
        <th class="text-end">Aromaticity:</th>
        <td class="ps-5">
          {{ entry.aromaticity }}
          <i
            class="bi bi-question-circle"
            data-toggle="tooltip"
            data-placement="right"
            title="Aromaticity according to Lobry (1994).&#013;It is the relative frequency of Phe+Trp+Tyr."
          ></i>
        </td>
      </tr>
      <tr>
        <th class="text-end">Molecular weight:</th>
        <td class="ps-5">
          {{ entry["molecular-weight"] }}
          <i
            class="bi bi-question-circle"
            data-toggle="tooltip"
            data-placement="right"
            title="Molecular weight of a protein sequence in Dalton."
          ></i>
        </td>
      </tr>
      <tr>
        <th class="text-end">Instability:</th>
        <td class="ps-5">
          {{ entry.instability }}
          <i
            class="bi bi-question-circle"
            data-toggle="tooltip"
            data-placement="right"
            title="Instability index according to Guruprasad et al. (1990).&#013;This index predicts the stability of a protein based on its dipeptide composition. A protein whose instability index is smaller than 40 is predicted as stable, a value above 40 predicts that the protein may be unstable."
          ></i>
        </td>
      </tr>
      <tr>
        <th class="text-end">Isoelectric point:</th>
        <td class="ps-5">
          {{ entry["isoelectric-point"] }}
          <i
            class="bi bi-question-circle"
            data-toggle="tooltip"
            data-placement="right"
            title="The isoelectric point (pI), is the pH at which a particular molecule or surface carries no net electrical charge.&#013;The pI is a variable that affects the solubility of the peptides under certain conditions of pH. When the pH of the solvent is equal to the pI of the protein, it tends to precipitate and lose its biological function."
          ></i>
        </td>
      </tr>
      <tr>
        <th class="text-end">Aliphatic-index:</th>
        <td class="ps-5">
          {{ entry["aliphatic-index"] }}
          <i
            class="bi bi-question-circle"
            data-toggle="tooltip"
            data-placement="right"
            title="Aliphatic index of a protein according to Ikai (1980).&#013;It is defined as the relative volume occupied by aliphatic side chains (Ala, Val, Ile, and Leu). It may be regarded as a positive factor for the increase of thermostability of globular proteins."
          ></i>
        </td>
      </tr>
      <tr>
        <th class="text-end">Boman:</th>
        <td class="ps-5">
          {{ entry.boman }}
          <i
            class="bi bi-question-circle"
            data-toggle="tooltip"
            data-placement="right"
            title="Potential interaction index proposed by Boman (2003).&#013;It can be used to give an overall estimate of the potential of a peptide to bind to membranes or other proteins."
          ></i>
        </td>
      </tr>
    </tbody>
  </table>
</template>

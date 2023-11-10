<script setup lang="ts">
import type { SorfdbEntry } from "@/model/SorfdbSearchResult";
import type { PropType } from "vue";
const props = defineProps({
  id: { type: String },
  entry: { type: Object as PropType<SorfdbEntry>, required: true },
});

function sourceUrl(source: string): string | undefined {
  if (source == "GenBank") {
    return "https://www.ncbi.nlm.nih.gov/genbank/";
  } else if (source == "UniProt") {
    return "https://www.uniprot.org/";
  } else if (source == "SwissProt") {
    return "https://www.uniprot.org/uniprotkb?facets=reviewed%3Atrue&query=%2A";
  } else if (source == "SmProt") {
    return "http://bigdata.ibp.ac.cn/SmProt/";
  } else {
    return undefined;
  }
}
function assemblyUrl(assembly: string): string {
  return "https://www.ncbi.nlm.nih.gov/search/all/?term=".concat(assembly);
}
function accessionUrl(accession: string, source: string): string | undefined {
  if (source == "GenBank") {
    return "https://www.ncbi.nlm.nih.gov/nuccore/".concat(accession);
  } else if (source == "SmProt") {
    return "http://bigdata.ibp.ac.cn/SmProt/keyword.htm";
  } else {
    return undefined;
  }
}
function proteinIdUrl(proteinId: string, source: string): string | undefined {
  if (source == "GenBank") {
    return "https://www.ncbi.nlm.nih.gov/protein/".concat(proteinId);
  } else if (source == "SmProt") {
    return "http://bigdata.ibp.ac.cn/SmProt/keyword.htm";
  } else {
    return undefined;
  }
}
function uidUrl(uid: string): string | undefined {
  return "https://www.uniprot.org/uniprotkb/" + uid + "/entry";
}
</script>

<template>
  <table>
    <tbody>
      <tr>
        <th class="text-end">sORFdb ID:</th>
        <td class="ps-5">{{ entry.id }}</td>
      </tr>
      <tr>
        <th class="text-end">Source database:</th>
        <td class="ps-5">
          <a :href="sourceUrl(entry.source)" target="_blank">
            {{ entry.source }}
          </a>
        </td>
      </tr>
      <tr v-if="entry.source == 'GenBank'">
        <th class="text-end">Assembly:</th>
        <td class="ps-5">
          <a :href="assemblyUrl(entry.assembly)" target="_blank">
            {{ entry.assembly }}
          </a>
        </td>
      </tr>
      <tr v-if="entry.source == 'GenBank' || entry.source == 'SmProt'">
        <th class="text-end">Accession:</th>
        <td class="ps-5">
          <a
            :href="accessionUrl(entry.accession, entry.source)"
            target="_blank"
          >
            {{ entry.accession }}
          </a>
        </td>
      </tr>
      <tr v-if="entry.source == 'GenBank' || entry.source == 'SmProt'">
        <th class="text-end">Protein ID:</th>
        <td class="ps-5">
          <a
            :href="proteinIdUrl(entry['protein-id'], entry.source)"
            target="_blank"
          >
            {{ entry["protein-id"] }}
          </a>
        </td>
      </tr>
      <tr v-if="entry.source == 'UniProt' || entry.source == 'SwissProt'">
        <th class="text-end">UID:</th>
        <td class="ps-5">
          <a :href="uidUrl(entry.uid)" target="_blank">
            {{ entry.uid }}
          </a>
        </td>
      </tr>
      <tr v-if="entry.source == 'UniProt' || entry.source == 'SwissProt'">
        <th class="text-end">Entry name:</th>
        <td class="ps-5">{{ entry["entry-name"] }}</td>
      </tr>
    </tbody>
  </table>
</template>

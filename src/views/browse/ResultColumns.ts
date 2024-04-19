export function defaultColumns() {
  return [
    "id",
    "species",
    "slen",
    "start-codon",
    "plen",
    "product",
    "rbs",
    "pfam-hits",
    "gravy",
    "aromaticity",
    "molecular-weight",
    "instability",
    "isoelectric-point",
    "aliphatic-index",
    "boman",
  ];
}

export function defaultClusterColumns() {
  return [
    "id",
    "statistics.sequenceCount",
    "statistics.averageSequenceLength",
    "statistics.medianSequenceLength",
    "function",
  ];
}

export function resultTableColums() {
  return [
    { group: "General", label: "sORF ID", key: "id", link: true },
    { group: "General", label: "Source database", key: "source" },
    { group: "General", label: "GenBank Assembly", key: "assembly" },
    { group: "General", label: "GenBank/SmProt Accession", key: "accession" },
    { group: "General", label: "GenBank/SmProt Protein ID", key: "protein-id" },
    { group: "General", label: "UniProtKB/Swiss-Prot UID", key: "uid" },
    {
      group: "General",
      label: "UniProtKB/Swiss-Prot entry name",
      key: "entry-name",
    },
    { group: "Taxonomy", label: "Phylum", key: "phylum" },
    { group: "Taxonomy", label: "Class", key: "class" },
    { group: "Taxonomy", label: "Order", key: "order" },
    { group: "Taxonomy", label: "Family", key: "family" },
    { group: "Taxonomy", label: "Genus", key: "genus" },
    { group: "Taxonomy", label: "Species", key: "species" },
    { group: "Taxonomy", label: "Strain", key: "strain" },
    { group: "Sequence&nbsp;features", label: "sORF", key: "sorf" },
    { group: "Sequence&nbsp;features", label: "sORF length", key: "slen" },
    {
      group: "Sequence&nbsp;features",
      label: "Start codon",
      key: "start-codon",
    },
    { group: "Sequence&nbsp;features", label: "Protein", key: "protein" },
    { group: "Sequence&nbsp;features", label: "Protein length", key: "plen" },
    { group: "Sequence&nbsp;features", label: "Product", key: "product" },
    {
      group: "Sequence&nbsp;features",
      label: "Ribosomal binding site",
      key: "rbs",
    },
    { group: "Protein&nbsp;descriptors", label: "Pfam hits", key: "pfam-hits" },
    { group: "Protein&nbsp;descriptors", label: "Gravy", key: "gravy" },
    {
      group: "Protein&nbsp;descriptors",
      label: "Aromaticity",
      key: "aromaticity",
    },
    {
      group: "Protein&nbsp;descriptors",
      label: "Molecular weight",
      key: "molecular-weight",
    },
    {
      group: "Protein&nbsp;descriptors",
      label: "Instability",
      key: "instability",
    },
    {
      group: "Protein&nbsp;descriptors",
      label: "Isoelectric point",
      key: "isoelectric-point",
    },
    {
      group: "Protein&nbsp;descriptors",
      label: "Aliphatic-index",
      key: "aliphatic-index",
    },
    { group: "Protein&nbsp;descriptors", label: "Boman", key: "boman" },
  ];
}

export function clusterResultTableColums() {
  return [
    { group: "General", label: "Family ID", key: "id", link: false },
    { group: "General", label: "Function", key: "function" },
    {
      group: "Statisitcs",
      label: "Sequence count",
      key: "statistics.sequenceCount",
    },
    {
      group: "Statisitcs",
      label: "Mean length",
      key: "statistics.averageSequenceLength",
    },
    {
      group: "Statisitcs",
      label: "Median Length",
      key: "statistics.medianSequenceLength",
    },
    {
      group: "Taxonomy",
      label: "Taxonomy",
      key: "statistics.taxonomy.label",
    },
  ];
}

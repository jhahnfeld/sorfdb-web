import { z } from "zod";

const PfamEntryScheme = z.object({
  name: z.string(),
  evalue: z.number(),
});

const SorfdbEntrySchema = z.object({
  id: z.string(),
  source: z.string(),
  assembly: z.string(),
  accession: z.string(),
  "protein-id": z.string(),
  uid: z.string(),
  "entry-name": z.string(),
  phylum: z.string(),
  class: z.string(),
  order: z.string(),
  family: z.string(),
  genus: z.string(),
  species: z.string(),
  strain: z.string(),
  sorf: z.string(),
  slen: z.number(),
  "start-codon": z.string(),
  protein: z.string(),
  plen: z.number(),
  product: z.string(),
  rbs: z.nullable(z.number()),
  "pfam-hits": z.array(PfamEntryScheme),
  gravy: z.number(),
  aromaticity: z.number(),
  "molecular-weight": z.number(),
  instability: z.number(),
  "isoelectric-point": z.number(),
  "aliphatic-index": z.number(),
  boman: z.number(),
});
const SorfdbSearchResultSchema = z.object({
  offset: z.optional(z.number()),
  search_after: z.array(
    z.union([z.string(), z.number(), z.boolean(), z.null()]),
  ),
  total: z.number(),
  results: z.array(SorfdbEntrySchema),
});

export type SorfdbEntry = z.infer<typeof SorfdbEntrySchema>;
export type SorfdbSearchResult = z.infer<typeof SorfdbSearchResultSchema>;

export { SorfdbEntrySchema, SorfdbSearchResultSchema };

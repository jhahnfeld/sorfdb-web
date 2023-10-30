import { z } from "zod";
import { GenomeSchema, StatsSchema } from "./BaktaResults";
import { QualitySchema } from "./CheckmResults";
import { ClassfificationSchema } from "./GtdbtkResult";

const PfamEntryScheme = z.object({
  name: z.string(),
  evalue: z.number()
})

const SorfdbEntrySchema = z.object({
  id: z.string(),
  source: z.string(), 
  assembly: z.optional(z.string()),
  accession: z.optional(z.string()),
  'protein-id': z.optional(z.string()),
  uid: z.optional(z.string()),
  'entry-name': z.optional(z.string()),
  phylum: z.optional(z.string()),
  class: z.optional(z.string()),
  order: z.optional(z.string()),
  family: z.optional(z.string()),
  genus: z.optional(z.string()),
  species: z.optional(z.string()),
  strain: z.optional(z.string()),
  sorf: z.optional(z.string()),
  slen: z.number(),
  'start-codon': z.optional(z.string()),
  protein: z.string(),
  plen: z.number(),
  product: z.optional(z.string()),
  rbs: z.nullable(z.number()),
  'pfam-subject': z.nullable(z.array(PfamEntryScheme)),
  gravy: z.number(),
  aromaticity: z.number(),
  'molecular-weight': z.number(),
  instability: z.number(),
  'isoelectric-point': z.number(),
  'aliphatic-index': z.number(),
  boman: z.number(),
});

const SimpleFeatureSchema = z.object({
  gene: z.optional(z.nullable(z.string())),
  product: z.optional(z.nullable(z.string())),
});

const SimpleGtdbtkSchema = z.object({
  classification: ClassfificationSchema,
});
const SimpleMlstEntrySchema = z.object({
  sequence_type: z.string(),
});
const SimpleCheckm2Schema = z.object({
  quality: QualitySchema,
});

const BakrepSearchEntrySchema = z.object({
  id: z.string(),
  bakta: z.optional(
    z.object({
      genome: GenomeSchema,
      stats: StatsSchema,
      features: z.optional(z.array(SimpleFeatureSchema)),
    }),
  ),
  gtdbtk: z.optional(SimpleGtdbtkSchema),
  mlst: z.optional(SimpleMlstEntrySchema),
  checkm2: z.optional(SimpleCheckm2Schema),
});

const BakrepSearchResultSchema = z.object({
  offset: z.optional(z.number()),
  search_after: z.array(
    z.union([z.string(), z.number(), z.boolean(), z.null()]),
  ),
  total: z.number(),
  results: z.array(BakrepSearchEntrySchema),
});

export type BakrepSearchResultEntry = z.infer<typeof BakrepSearchEntrySchema>;
export type BakrepSearchResult = z.infer<typeof BakrepSearchResultSchema>;

export type SorfdbEntry = z.infer<typeof SorfdbEntrySchema>;

export { SorfdbEntrySchema, BakrepSearchEntrySchema, BakrepSearchResultSchema };

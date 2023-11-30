import { z } from "zod";

const hspEntrySchema = z.object({
  number: z.number(),
  bit_score: z.number(),
  score: z.number(),
  evalue: z.number(),
  qstart: z.number(),
  qend: z.number(),
  sstart: z.number(),
  send: z.number(),
  qframe: z.number(),
  sframe: z.number(),
  identity: z.number(),
  positives: z.number(),
  gaps: z.number(),
  length: z.number(),
  qcovhsp: z.number(),
  qseq: z.string(),
  sseq: z.string(),
  midline: z.string(),
});

const hitEntrySchema = z.object({
  number: z.number(),
  id: z.string(),
  accession: z.string(),
  title: z.string(),
  length: z.number(),
  total_score: z.number(),
  qcovs: z.number(),
  sciname: z.string(),
  hsps: z.array(hspEntrySchema),
  links: z.array(z.any()),
});

const qeryEntrySchema = z.object({
  number: z.number(),
  id: z.string(),
  title: z.string(),
  length: z.number(),
  hits: z.array(hitEntrySchema),
});

const BlastJsonSchema = z.object({
  cloud_sharing_enabled: z.boolean(),
  imported_xml: z.boolean(),
  non_parse_seqids: z.boolean(),
  params: z.any(),
  queries: z.array(qeryEntrySchema),
  querydb: z.any(),
  program: z.string(),
  program_version: z.string(),
  search_id: z.string(),
  seqserv_version: z.string(),
  stats: z.any(),
  submitted_at: z.string(),
});

export type BlastJson = z.infer<typeof BlastJsonSchema>;

export { BlastJsonSchema };

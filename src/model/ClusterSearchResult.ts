import { z } from "zod";

const TreeNodeScheme = z.object({
  id: z.string(),
  rank: z.string(),
  label: z.string(),
  value: z.number(),
  parent: z.optional(z.string()),
});

const FastaContentScheme = z.string();
const FlatTreeScheme = z.array(TreeNodeScheme);

const ClusterEntryScheme = z.object({
  id: z.string(),
  statistics: z.object({
    sequenceCount: z.number(),
    averageSequenceLength: z.number(),
    MedianSequenceLength: z.number(),
    taxonomy: FlatTreeScheme,
  }),
  function: z.string(),
  alignment: FastaContentScheme,
});

const SorfdbClusterSearchResultSchema = z.object({
  offset: z.optional(z.number()),
  search_after: z.array(
    z.union([z.string(), z.number(), z.boolean(), z.null()]),
  ),
  total: z.number(),
  results: z.array(ClusterEntryScheme),
});

export type FastaContent = z.infer<typeof FastaContentScheme>;
export type TreeNodeEntry = z.infer<typeof TreeNodeScheme>;
export type FlatTree = z.infer<typeof FlatTreeScheme>;
export type ClusterEntry = z.infer<typeof ClusterEntryScheme>;
export type SorfdbClusterSearchResult = z.infer<
  typeof SorfdbClusterSearchResultSchema
>;

export {
  TreeNodeScheme,
  FlatTreeScheme,
  ClusterEntryScheme,
  FastaContentScheme,
};

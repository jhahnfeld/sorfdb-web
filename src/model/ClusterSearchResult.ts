import { z } from "zod";

const TreeNodeScheme = z.object({
  id: z.number(),
  rank: z.string(),
  label: z.string(),
  value: z.number(),
  parent: z.nullable(z.number()),
});

const FlatTreeScheme = z.array(TreeNodeScheme);

const ClusterEntryScheme = z.object({
  id: z.string(),
  statistics: z.object({
    sequenceCount: z.number(),
    averageSequenceLength: z.number(),
    medianSequenceLength: z.number(),
    taxonomy: FlatTreeScheme,
  }),
  function: z.string(),
  alignment: z.string(),
});

const ClusterSearchScheme = z.object({
  id: z.string(),
  statistics: z.object({
    sequenceCount: z.number(),
    averageSequenceLength: z.number(),
    medianSequenceLength: z.number(),
    taxonomy: FlatTreeScheme,
  }),
  function: z.string(),
});

const SorfdbClusterSearchResultScheme = z.object({
  offset: z.optional(z.number()),
  search_after: z.array(
    z.union([z.string(), z.number(), z.boolean(), z.null()]),
  ),
  total: z.number(),
  results: z.array(ClusterSearchScheme),
});

export type TreeNodeEntry = z.infer<typeof TreeNodeScheme>;
export type FlatTree = z.infer<typeof FlatTreeScheme>;
export type ClusterEntry = z.infer<typeof ClusterEntryScheme>;
export type ClusterSearchEntry = z.infer<typeof ClusterSearchScheme>;
export type SorfdbClusterSearchResult = z.infer<
  typeof SorfdbClusterSearchResultScheme
>;

export {
  TreeNodeScheme,
  FlatTreeScheme,
  ClusterEntryScheme,
  SorfdbClusterSearchResultScheme,
};

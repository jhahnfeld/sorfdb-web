type Cluster = {
  id: string;
  statistics: {
    sequenceCount: number;
    averageSequenceLength: number;
    taxonomy: FlatTree;
  };
  function: string;
  alignment: Fastacontent;
};

type TreeNode = {
  id: string;
  label: string;
  value: number;
  parent: string | undefined;
};

type FlatTree = TreeNode[];

type Fastacontent = string;

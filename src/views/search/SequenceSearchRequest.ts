type IdRequest = {
  type: "id";
  ids: string[];
};

type ExactSequenceRequest = {
  mode: "exact";
  type: "protein" | "dna";
  sequences: string[];
};

type AlignSequenceRequest = {
  mode: "blast";
  type: "protein" | "dna";
  sequences: string[];
  blastOptions: {
    min_identity_cutoff: number;
    min_coverage_cutoff: number;
  };
};

export type SequenceSearchRequest =
  | IdRequest
  | ExactSequenceRequest
  | AlignSequenceRequest;

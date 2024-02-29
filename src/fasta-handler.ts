function extractSequencesFromFasta(
  fastaString: string,
  maxLength: number,
): string[] {
  const fastaSet: Set<string> = new Set();
  let header: string | null = null;
  let sequences: string[] = [];
  for (let line of fastaString.split("\n")) {
    line = line.trim();
    if (line.startsWith(">") || line.startsWith("@")) {
      if (header != null) {
        fastaSet.add(sequences.join(""));
        sequences = [];
      }
      header = line;
    } else {
      sequences.push(line);
    }
  }
  if (header != null && sequences.length > 0) {
    fastaSet.add(sequences.join(""));
  }
  return [...fastaSet].filter((x) => x.length <= maxLength);
}

function uniqueArray(array: Array<any>): Array<any> {
  return [...new Set(array)];
}

function fastaFromSequences(seqs: string[]): string {
  let fasta: string = "";
  for (let i = 0; i < seqs.length; i++) {
    fasta += ">".concat(i.toString(), "\n", seqs[i], "\n");
  }
  return fasta;
}

export { extractSequencesFromFasta, fastaFromSequences, uniqueArray };

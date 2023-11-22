function extractSequencesFromFasta(
  fastaString: string,
  maxLength: number,
): string[] {
  const fastaSet: Set<string> = new Set();
  let header: string | null = null;
  let sequences: string[] = [];
  for (const line of fastaString.split("\n")) {
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

export { extractSequencesFromFasta, uniqueArray };

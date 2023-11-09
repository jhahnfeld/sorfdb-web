function extractSequencesFromFasta(
  fastaString: string,
  maxLength: number,
): string[] {
  const fastaAsArray: string[] = [];
  let header: string | null = null;
  let sequences: string[] = [];
  for (const line of fastaString.split("\n")) {
    if (line.startsWith(">") || line.startsWith("@")) {
      if (header != null) {
        //fastaAsArray.push(header);
        fastaAsArray.push(sequences.join(""));
        sequences = [];
      }
      header = line;
    } else {
      sequences.push(line);
    }
  }
  if (header != null && sequences.length > 0) {
    //fastaAsArray.push(header);
    fastaAsArray.push(sequences.join(""));
  }
  return uniqueArray(fastaAsArray).filter((x) => x.length <= maxLength);
}

function excludeFastaHeaders(fastaArray: string[]): string[] {
  return fastaArray.filter((x) => !x.startsWith(">") && !x.startsWith("@"));
}

function uniqueArray(array: Array<any>): Array<any> {
  return [...new Set(array)];
}

export { extractSequencesFromFasta, excludeFastaHeaders, uniqueArray };

function parseFastaFromText(fastaString: string): string[] {
  const fastaAsArray: string[] = [];
  let header: string | null = null;
  let sequences: string[] = [];
  for (const line of fastaString.split("\n")) {
    if (line.startsWith(">")) {
      if (header != null) {
        fastaAsArray.push(header);
        fastaAsArray.push(sequences.join(""));
        sequences = [];
      }
      header = line;
    } else {
      sequences.push(line);
    }
  }
  if (header != null && sequences.length > 0) {
    fastaAsArray.push(header);
    fastaAsArray.push(sequences.join(""));
  }
  return fastaAsArray;
}

function excludeFastaHeaders(fastaArray: string[]): string[] {
  return fastaArray.filter((x) => !x.startsWith(">"));
}

export { parseFastaFromText, excludeFastaHeaders };
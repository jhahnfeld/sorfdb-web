const simple_dna: string[] = "acgtn".split("");
//const iupac_dna: string[] = "acgtmrwsykvhdbn".split("");
const iupac_protein: string[] = "acdefghiklmnpqrstvwyuox".split(""); // added Selenocysteine and Pyrrolysine and X
//const idRegex: RegExp = new RegExp('^(Genbank|SwissProt|UniProt|SmProt){1}\|(\w|\.)+\|(\w|\.)+$', 'g');

const dna_alphabet: Set<string> = new Set([
  ...simple_dna,
  ...simple_dna.map((x) => x.toUpperCase()),
]);

const protein_alphabet: Set<string> = new Set([
  ...iupac_protein,
  ...iupac_protein.map((x) => x.toUpperCase()),
]);

function matchesAlphabet(seq: string, alphabet: Set<string>): boolean {
  for (let i = 0; i < seq.length; i++) {
    const char: string = seq[i];
    if (!alphabet.has(char)) {
      console.log(
        `Invalid dna character '${char}' at position '${i}' in sequence '${seq}'`,
      );
      return false;
    }
  }
  return true;
}

function matchesIdScheme(id: string): boolean {
  if (
    (id.startsWith("GenBank|") ||
      id.startsWith("SwissProt|") ||
      id.startsWith("UniProt|") ||
      id.startsWith("SmProt|")) &&
    (id.match(/\|/g) || []).length == 2
  ) {
    return true;
  } else {
    return false;
  }
  // return idRegex.test(sequence)
}

function validateProtein(sequence: string): boolean {
  return matchesAlphabet(sequence, protein_alphabet);
}

function validateDNA(sequence: string): boolean {
  return matchesAlphabet(sequence, dna_alphabet);
}

function validateInputArray(input: string[], validator: Function): boolean {
  if (input.length == 0) {
    return false;
  }
  return input.map((x) => validator(x)).every((b) => b === true);
}

interface GuessedType {
  valid: boolean;
  type: string;
}

function guessInputType(sequence: string): GuessedType {
  const isProtein: boolean = validateProtein(sequence);
  const isDNA: boolean = validateDNA(sequence);
  const isID: boolean = matchesIdScheme(sequence);

  if (isDNA) {
    return {
      valid: true,
      type: "dna",
    };
  } else if (isProtein) {
    return {
      valid: true,
      type: "protein",
    };
  } else if (isID) {
    return {
      valid: true,
      type: "id",
    };
  } else {
    return {
      valid: false,
      type: "invalid",
    };
  }
}

export {
  guessInputType,
  validateProtein,
  validateDNA,
  matchesIdScheme,
  validateInputArray,
};

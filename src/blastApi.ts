import { toJson, sleep } from "@/util";
import { BlastJsonSchema, type BlastJson } from "@/model/BlastResponses";

interface BlastDbs {
  protein: string;
}

const BlastProfiles: Record<string, string> = {
  blastn: "-task blastn-short -soft_masking false -evalue 1",
  blastp:
    "-task blastp-short -matrix BLOSUM62 -comp_based_stats 0 -soft_masking false -seg no -evalue 1",
  blastx:
    "-word_size 2 -gapopen 9 -gapextend 1 -threshold 16 -window_size 15 -matrix BLOSUM62 -comp_based_stats 0 -soft_masking false -seg no -evalue 1",
  tblastx:
    "-word_size 2 -matrix BLOSUM62 -comp_based_stats 0 -soft_masking false -seg no -evalue 1",
  tblastn:
    "-word_size 2 -matrix BLOSUM62 -comp_based_stats 0 -soft_masking false -seg no -evalue 1",
};

async function getBlastDbs() {
  const headers: Headers = new Headers();
  headers.set("Content-Type", "application/json");
  const response = await fetch(
    "https://sorfdb.computational.bio/blast/searchdata.json",
    {
      method: "GET",
      headers: headers,
    },
  );
  if (response.ok) {
    return await toJson(response);
  } else {
    alert("HTTP-Error: " + response.status);
  }
}

async function getCsrfToken(): Promise<string> {
  return fetch("https://sorfdb.computational.bio/blast/")
    .then((r) => r.text())
    .then((t) => {
      const html = new DOMParser().parseFromString(t, "text/html");
      const token = html.querySelector("meta[name='_csrf']").content;
      if (token === undefined || token === null) {
        throw "Page does not contain csrf-token";
      }
      return token;
    });
}

async function getBlastDbIds(): Promise<BlastDbs | undefined> {
  const searchinfo = await getBlastDbs();
  const db: Map<string, string> = searchinfo.database;
  for (const dbEntry of Object.values(db)) {
    if (dbEntry.type == "protein") {
      const blastDbs: BlastDbs = { protein: dbEntry.id };
      return blastDbs;
    }
  }
}

async function getBlastResult(baseURL: string): Promise<BlastJson | null> {
  const blastJsonResultURL: string = baseURL.concat(".json");
  const headers: Headers = new Headers();
  headers.set("Content-Type", "application/json");
  headers.set("Accept", "application/json");
  const request: RequestInfo = new Request(blastJsonResultURL, {
    method: "GET",
    headers: headers,
  });
  try {
    let response = await fetch(request);
    let status: number = response.status;
    while (status == 202) {
      await sleep(5000);
      try {
        response = await fetch(request);
        status = response.status;
      } catch (e) {
        console.log(e);
        return null;
      }
    }
    const responseBody = await toJson(response);
    const blastResult = BlastJsonSchema.parse(responseBody);
    return blastResult;
  } catch (e) {
    console.log(e);
    return null;
  }
}

async function blastRequest(
  method: string,
  queries: string,
): Promise<BlastJson | null> {
  const dbIds = await getBlastDbIds();
  const token = await getCsrfToken();
  if (dbIds) {
    const formData = new FormData();
    formData.append("databases[]", dbIds.protein);
    formData.append("method", method);
    formData.append("sequence", queries);
    formData.append("advanced", BlastProfiles[method]);
    formData.append("_csrf", token);

    const request: RequestInfo = new Request(
      "https://sorfdb.computational.bio/blast/",
      {
        method: "POST",
        body: formData,
      },
    );
    try {
      const response = await fetch(request);
      if (response.ok) {
        const blastResultURL: string =
          "https://sorfdb.computational.bio/blast/".concat(
            response.url.split("/")[response.url.split("/").length - 1],
          );
        console.log(blastResultURL);
        const blastResult: BlastJson | null =
          await getBlastResult(blastResultURL);
        return blastResult;
      } else {
        return null;
      }
    } catch (e) {
      console.log(e);
      return null;
    }
  }
  return null;
}

function parseBlastResults(
  results: BlastJson,
  identityThreshold: number,
  coverageThreshold: number,
): Set<string> {
  const subjectIds: Set<string> = new Set();
  for (const queryHits of results.queries) {
    for (const hit of queryHits.hits) {
      for (const hsp of hit.hsps) {
        const hitIdentity: number = (hsp.identity / hsp.length) * 100;
        const scov: number = (hsp.length / hit.length) * 100;
        if (
          hitIdentity >= identityThreshold &&
          hit.qcovs >= coverageThreshold &&
          scov >= coverageThreshold
        ) {
          subjectIds.add(hit.id);
        }
      }
    }
  }
  return subjectIds;
}

export { blastRequest, parseBlastResults };

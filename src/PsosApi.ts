import { toJson, sleep } from "@/util";
// import { psosResponseScheme, type psosResponse } from "@/model/PsosResponse";

async function sendPsosRequest(query: string) {
  const headers: Headers = new Headers();
  headers.set("Content-Type", "application/json");
  headers.set("Accept", "application/json");
  const request: RequestInfo = new Request(
    "https://psos.computational.bio/api/v1/job/submit",
    {
      method: "POST",
      headers: headers,
      body: query,
    },
  );
  try {
    const response = await fetch(request);
    const responseBody = await toJson(response);
    return responseBody;
  } catch (e) {
    console.log(e);
    return e;
  }
}

async function getPsosId(protein: string): Promise<string> {
  const query: string = JSON.stringify({
    configuration: { profile: "bacteria-gram+" },
    sequence: protein,
  });
  const psosJson = await sendPsosRequest(query);
  console.log(psosJson.id);
  return psosJson.id;
}

async function openPsos(protein: string) {
  const psosId = await getPsosId(protein);
  window.open("https://psos.computational.bio/psov2/".concat(psosId));
}

async function getPsosSorfdbId(protein: string): Promise<string> {
  const query: string = JSON.stringify({
    type: "sequence",
    configuration: { profile: "bacteria-sorfdb" },
    source_app: "psov2",
    sequence: protein,
  });
  const psosJson = await sendPsosRequest(query);
  return psosJson.id;
}

async function PsosSorfdbSucceded(psosId: string): Promise<boolean | unknown> {
  const request: RequestInfo = new Request(
    "https://psos.computational.bio/api/v1/job/" + psosId,
  );
  try {
    const response = await fetch(request);
    let responseBody = await toJson(response);
    let succeded: string = responseBody.state.value;
    while (succeded != "Succeeded") {
      console.log(succeded);
      await sleep(5000);
      responseBody = await toJson(await fetch(request));
      succeded = responseBody.state.value;
      if (succeded == "Failed") {
        const err = new Error("Psos sORFdb search failed.");
        return err;
      }
    }
    return true;
  } catch (e) {
    console.log(e);
    return e;
  }
}

async function loadPsosSorfdbResults(
  resultFiles: Record<string, string>[],
): Promise<string[]> {
  const fileNames: string[] = [];
  resultFiles.forEach((element) => {
    if (element.type == "result" && element.name != "config.json") {
      fileNames.push(element.name);
    }
  });
  return fileNames;
}

async function getPsosSorfdbResult(
  psosId: string,
): Promise<string[] | unknown> {
  const succeded = await PsosSorfdbSucceded(psosId);
  if (succeded) {
    const request: RequestInfo = new Request(
      "https://psos.computational.bio/api/v1/job/" +
        psosId +
        "/file/config.json",
    );
    try {
      const psosResultsResponse = await fetch(request);
      const psosResults = await toJson(psosResultsResponse);
      const psosResultFiles = await loadPsosSorfdbResults(
        psosResults.data.files,
      );
      return psosResultFiles;
    } catch (e) {
      console.log(e);
      //return e;
    }
  }
}

async function getPsosSorfdbResultFamilies(
  resultFiles: string[],
  psosId: string,
): Promise<string[]> {
  const familyIds: string[] = [];
  for (const f of resultFiles) {
    try {
      const request: RequestInfo = new Request(
        "https://psos.computational.bio/api/v1/job/" + psosId + "/file/" + f,
      );
      const psosResultsFileResponse = await fetch(request);
      const psosResultsFile = await toJson(psosResultsFileResponse);
      const hits = psosResultsFile.computations;
      for (const hit of hits) {
        const hr = hit.results;
        hr.forEach((hmmHit: Record<string, Record<string, string>>) => {
          const hrt = hmmHit.target;
          const hrtm = hrt.name;
          familyIds.push(hrtm);
        });
      }
    } catch (e) {
      console.log(e);
      //return e;
    }
  }
  return familyIds;
}

async function getPsosSorfdbHits(proteins: string): Promise<string[]> {
  const psosId = await getPsosSorfdbId(proteins);
  console.log(psosId);
  const psosResults = await getPsosSorfdbResult(psosId);
  const familyIds: string[] = await getPsosSorfdbResultFamilies(
    psosResults,
    psosId,
  );
  return familyIds;
}

export { openPsos, getPsosSorfdbHits };

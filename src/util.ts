import json5 from "json5";

export function toJson(r: Response) {
  if (!r.ok)
    return r
      .text()
      .then((t) => Promise.reject(`${r.status}: ${r.statusText}\n${t}`));
  return r.text().then(json5.parse);
}

export function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

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

export function round(number: number, precision: number) {
  if (precision < 0) {
    const factor = Math.pow(10, precision);
    return Math.round(number * factor) / factor;
  } else
    return +(Math.round(Number(number + "e+" + precision)) + "e-" + precision);
}

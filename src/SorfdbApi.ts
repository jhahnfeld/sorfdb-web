import json5 from "json5";

import type { SearchInfo, SearchRequest } from "./model/Search";
import {
  tsvSearchResultFromText,
  type TsvSearchResult,
} from "./model/TsvSearchResult";
import {
  SorfdbSearchResultSchema,
  type SorfdbSearchResult,
} from "./model/SorfdbSearchResult";

let baseurl: string = "http://localhost:8080";
function initApi(url: string) {
  baseurl = url;
}

interface SorfdbApi {
  search(request: SearchRequest): Promise<SorfdbSearchResult>;
  searchTsv(
    request: SearchRequest,
    includeHeader?: boolean,
    abort?: AbortController | undefined,
  ): Promise<TsvSearchResult>;
  searchinfo(): Promise<SearchInfo>;
}

class SorfdbApiImpl implements SorfdbApi {
  baseurl: string;
  constructor(baseurl: string) {
    this.baseurl = baseurl;
  }

  toJson(r: Response): Promise<any> {
    if (!r.ok)
      return r
        .text()
        .then((t) => Promise.reject(`${r.status}: ${r.statusText}\n${t}`));
    return r.text().then(json5.parse);
  }

  searchinfo(): Promise<SearchInfo> {
    return fetch(baseurl + "/search/_info")
      .then(this.toJson)
      .then((j) => j as SearchInfo);
  }
  search(request: SearchRequest): Promise<SorfdbSearchResult> {
    return fetch(baseurl + "/search", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(request),
    })
      .then(this.toJson)
      .then((j) => SorfdbSearchResultSchema.parse(j));
  }
  searchTsv(
    request: SearchRequest,
    includeHeader = true,
    abort: AbortController | undefined = undefined,
  ): Promise<TsvSearchResult> {
    let path = baseurl + "/search";
    if (!includeHeader) path += "?header=false";
    const options: RequestInit = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "text/tab-separated-values",
      },
      body: JSON.stringify(request),
    };
    if (abort) options.signal = abort.signal;
    return fetch(path, options)
      .then((r) => {
        if (!r.ok)
          return r
            .text()
            .then((t) => Promise.reject(`${r.status}: ${r.statusText}\n${t}`));
        return r.text();
      })
      .then(tsvSearchResultFromText);
  }
}

function useApi(): SorfdbApi {
  return new SorfdbApiImpl(baseurl);
}

export { initApi, useApi };
export type { SorfdbApi };

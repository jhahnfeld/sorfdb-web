import json5 from "json5";

import type { SearchInfo, SearchRequest } from "./model/Search";
import {
  tsvSearchResultFromText,
  type TsvSearchResult,
} from "./model/TsvSearchResult";
import {
  SorfdbSearchResultSchema,
  SorfdbEntrySchema,
  type SorfdbSearchResult,
  type SorfdbEntry,
} from "./model/SorfdbSearchResult";
import {
  SorfdbClusterSearchResultScheme,
  ClusterEntryScheme,
  type SorfdbClusterSearchResult,
  type ClusterEntry,
} from "./model/ClusterSearchResult";

let baseurl: string = "http://localhost:8080";
function initApi(url: string) {
  baseurl = url;
}

interface SorfdbApi {
  entry(id: string): Promise<SorfdbEntry>;
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
  entry(id: string): Promise<SorfdbEntry> {
    return fetch(baseurl + "/entries/" + encodeURIComponent(id))
      .then(this.toJson)
      .then((j) => SorfdbEntrySchema.parse(j));
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

interface SorfdbClusterApi {
  entry(id: string): Promise<ClusterEntry>;
  search(request: SearchRequest): Promise<SorfdbClusterSearchResult>;
  searchTsv(
    request: SearchRequest,
    includeHeader?: boolean,
    abort?: AbortController | undefined,
  ): Promise<TsvSearchResult>;
  searchinfo(): Promise<SearchInfo>;
}

class SorfdbClusterApiImpl implements SorfdbClusterApi {
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
  entry(id: string): Promise<ClusterEntry> {
    return fetch(baseurl + "/clusters/" + encodeURIComponent(id))
      .then(this.toJson)
      .then((j) => ClusterEntryScheme.parse(j));
  }
  searchinfo(): Promise<SearchInfo> {
    return fetch(baseurl + "/clusters/search/_info")
      .then(this.toJson)
      .then((j) => j as SearchInfo);
  }
  search(request: SearchRequest): Promise<SorfdbClusterSearchResult> {
    return fetch(baseurl + "/clusters/search", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(request),
    })
      .then(this.toJson)
      .then((j) => SorfdbClusterSearchResultScheme.parse(j));
  }
  searchTsv(
    request: SearchRequest,
    includeHeader = true,
    abort: AbortController | undefined = undefined,
  ): Promise<TsvSearchResult> {
    let path = baseurl + "/clusters/search";
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

function useClusterApi(): SorfdbClusterApi {
  return new SorfdbClusterApiImpl(baseurl);
}

export { initApi, useApi, useClusterApi };
export type { SorfdbApi, SorfdbClusterApi };

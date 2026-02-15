export interface HealthResponse {
  status: string;
  version: string;
}

export interface SeedResponse {
  inserted: number;
  message: string;
}

export interface Citation {
  text: string;
}

export interface DebugInfo {
  top_doc_ids: string[];
  latency_ms: number;
}

export interface AnswerResponse {
  text: string;
  citations: string[];
  debug: DebugInfo;
}

export interface AnswerRequest {
  query: string;
  top_k?: number;
}

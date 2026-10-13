export interface WatchProvider {
  provider_id: number;
  provider_name: string;
  logo_path: string | null;
  display_priority: number;
}

export interface CountryWatchProviders {
  link?: string;
  flatrate?: WatchProvider[];
  rent?: WatchProvider[];
  buy?: WatchProvider[];
}

export interface WatchProvidersResponse {
  id: number;
  results: Record<string, CountryWatchProviders>;
}

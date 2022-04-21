export interface WatchProvidersTypes {
  id: number;
  results?: WatchProvidersResults;
}

export interface WatchProvidersResults {
  AR?: ViewingTypes;
  AT?: ViewingTypes;
  AU?: ViewingTypes;
  BE?: ViewingTypes;
  BR?: ViewingTypes;
  CA?: ViewingTypes;
  CH?: ViewingTypes;
  CL?: ViewingTypes;
  CO?: ViewingTypes;
  CZ?: ViewingTypes;
  DE?: ViewingTypes;
  DK?: ViewingTypes;
  EC?: ViewingTypes;
  ES?: ViewingTypes;
  FI?: ViewingTypes;
  FR?: ViewingTypes;
  GB?: ViewingTypes;
  HU?: ViewingTypes;
  IE?: ViewingTypes;
  IN?: ViewingTypes;
  IT?: ViewingTypes;
  JP?: ViewingTypes;
  MX?: ViewingTypes;
  NL?: ViewingTypes;
  NO?: ViewingTypes;
  NZ?: ViewingTypes;
  PE?: ViewingTypes;
  PL?: ViewingTypes;
  PT?: ViewingTypes;
  RO?: ViewingTypes;
  RU?: ViewingTypes;
  SE?: ViewingTypes;
  TR?: ViewingTypes;
  US?: ViewingTypes;
  VE?: ViewingTypes;
  ZA?: ViewingTypes;
}

export interface ProviderInfo {
  display_priority?: number;
  logo_path?: string;
  provider_id?: number | string;
  provider_name?: string;
}

export interface ViewingTypes {
  link?: string;
  buy?: ProviderInfo[];
  flatrate?: ProviderInfo[];
  ads?: ProviderInfo[];
  rent?: ProviderInfo[];
  free?: ProviderInfo[];
}

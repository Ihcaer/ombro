export interface EnvConfig {
  readonly production: boolean;
  readonly api: {
    readonly domain: string;
    readonly baseUrl: string;
  };
  readonly coreFeatures: {};
  readonly addonFeatures: {};
}

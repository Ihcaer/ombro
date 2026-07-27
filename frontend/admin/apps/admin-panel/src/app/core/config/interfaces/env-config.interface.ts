export interface EnvConfig {
  readonly production: boolean;
  readonly api: {
    readonly domain: string;
    readonly baseUrl: string;
    readonly endpoints: { readonly public: string; readonly admin: string };
  };
  readonly coreFeatures: {};
  readonly addonFeatures: {};
}

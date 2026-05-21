export interface EnvConfig {
  readonly production: boolean;
  readonly apiDomain: string;
  /** should starts with "/" */
  readonly apiSlug: string;
  readonly coreFeatures: {};
  readonly addonFeatures: {};
}

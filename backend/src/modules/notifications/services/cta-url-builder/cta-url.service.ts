import metadataConfig from '@core/config/envs/metadata.config';
import serverConfig, { Environment } from '@core/config/envs/server.config';
import { Inject, Injectable } from '@nestjs/common';
import type { ConfigType } from '@nestjs/config';

@Injectable()
export class CtaUrlService {
  private readonly protocol: 'https' | 'http';
  private readonly domain: string;

  readonly mediaDomain: string;

  constructor(
    @Inject(serverConfig.KEY)
    private serverConf: ConfigType<typeof serverConfig>,
    @Inject(metadataConfig.KEY)
    private metadataConf: ConfigType<typeof metadataConfig>,
  ) {
    this.protocol = serverConf.nodeEnv === Environment.Production ? 'https' : 'http';
    this.domain = metadataConf.mainDomain;
    this.mediaDomain = metadataConf.mediaDomain;
  }

  createCtaLink(slug: string, token?: string): string {
    const baseUrl: string = `${this.protocol}://${this.domain}/${slug}`;
    return token ? `${baseUrl}/${token}` : baseUrl;
  }
}

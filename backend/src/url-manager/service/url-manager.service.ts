import { Injectable } from '@nestjs/common';
import { UrlManagerRedirectCode as PrismaRedirectCode } from '@generated/prisma-client';
import { PrismaService } from '@prisma/prisma.service';
import { CreateUrlRedirectDto } from '@url-manager/dto/create-redirect.dto';
import { GetRedirectDto } from '@url-manager/dto/get-redirect.dto';
import { RedirectCode } from '@url-manager/enums/redirect-code.enum';

const CodeValueToSymbolMap: Record<string, PrismaRedirectCode> = {
  '301': 'MOVED_PERMANENTLY_301',
  '302': 'FOUND_302',
  '307': 'TEMPORARY_REDIRECT_307',
  '308': 'PERMANENT_REDIRECT_308',
} as const;

const symbolValueToCode = (symbol: PrismaRedirectCode): RedirectCode => {
  const code: string = symbol.slice(-3);

  if ((Object.values(RedirectCode) as string[]).includes(code)) {
    return code as RedirectCode;
  }

  throw new Error(`Unknown DB Symbol Status: ${symbol}`);
};

@Injectable()
export class UrlManagerService {
  constructor(private prisma: PrismaService) {}

  async createUrlRedirect(
    createRedirectDto: CreateUrlRedirectDto,
  ): Promise<void> {
    const prismaSymbol = CodeValueToSymbolMap[createRedirectDto.redirectCode];

    await this.prisma.urlManagerRedirect.upsert({
      where: {
        sourceUrl: createRedirectDto.sourceUrl,
      },
      update: {
        targetUrl: createRedirectDto.targetUrl,
        redirectType: prismaSymbol,
        createdAt: new Date(),
      },
      create: {
        sourceUrl: createRedirectDto.sourceUrl,
        targetUrl: createRedirectDto.targetUrl,
        redirectType: prismaSymbol,
      },
    });
  }

  async checkUrlRedirect(url: string): Promise<GetRedirectDto | false> {
    const redirectRecord: {
      targetUrl: string;
      redirectType: PrismaRedirectCode;
    } | null = await this.prisma.urlManagerRedirect.findUnique({
      where: {
        sourceUrl: url,
      },
      select: {
        targetUrl: true,
        redirectType: true,
      },
    });

    if (!redirectRecord) {
      return false;
    } else {
      return {
        targetUrl: redirectRecord.targetUrl,
        redirectCode: symbolValueToCode(redirectRecord.redirectType),
      };
    }
  }
}

import { Controller, Get } from '@nestjs/common';
import { HealthCheck } from '@nestjs/terminus';

type HealthResponse = {
  status: 'ok';
  timestamp: string;
};

@Controller('healthz')
export class HealthController {
  constructor() {}

  @Get()
  @HealthCheck()
  check(): HealthResponse {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
    };
  }
}

import { Test, TestingModule } from '@nestjs/testing';
import { AuditService } from './audit.service.js';
import { getQueueToken } from '@nestjs/bullmq';
import { AUDIT_QUEUE_NAME } from './audit-queue.constants.js';

describe('AuditService', () => {
  let service: AuditService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuditService,
        { provide: getQueueToken(AUDIT_QUEUE_NAME), useValue: { add: vi.fn() } },
      ],
    }).compile();

    service = module.get<AuditService>(AuditService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

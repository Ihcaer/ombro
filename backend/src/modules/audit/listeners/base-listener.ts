import { AuditService } from '../audit.service.js';

export abstract class AuditBaseListener<T extends object = object> {
  constructor(protected readonly auditService: AuditService) {}

  protected abstract handle(event: T): void;
}

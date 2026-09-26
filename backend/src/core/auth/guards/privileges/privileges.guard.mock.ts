import { ExecutionContext } from '@nestjs/common';
import { HttpArgumentsHost } from '@nestjs/common/internal';

export const createMockContext = (customRequest: unknown): ExecutionContext => {
  const httpContext: Partial<HttpArgumentsHost> = {
    getRequest: vi.fn().mockReturnValue(customRequest),
  };

  const mockContext: Partial<ExecutionContext> = {
    getType: vi.fn().mockReturnValue('http'),
    getHandler: vi.fn(),
    getClass: vi.fn(),
    switchToHttp: vi.fn().mockReturnValue(httpContext),
  };

  return mockContext as ExecutionContext;
};

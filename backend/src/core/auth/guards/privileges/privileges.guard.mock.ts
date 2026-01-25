import { ExecutionContext } from '@nestjs/common';
import { HttpArgumentsHost } from '@nestjs/common/interfaces';

export const createMockContext = (customRequest: unknown): ExecutionContext => {
  const httpContext: Partial<HttpArgumentsHost> = {
    getRequest: jest.fn().mockReturnValue(customRequest),
  };

  const mockContext: Partial<ExecutionContext> = {
    getType: jest.fn().mockReturnValue('http'),
    getHandler: jest.fn(),
    getClass: jest.fn(),
    switchToHttp: jest.fn().mockReturnValue(httpContext as HttpArgumentsHost),
  };

  return mockContext as ExecutionContext;
};

import { ExecutionContext } from '@nestjs/common';
import { AuthGuard } from './auth.guard';
import { createMock } from '@golevelup/ts-jest';
import { LoggerService } from '../../logger.service';

describe('AuthGuard', () => {
  const authGuard = new AuthGuard(new LoggerService());

  it('should be defined', () => {
    expect(authGuard).toBeDefined();
  });

  it('should return true if the header contains the secret', () => {
    const mockContext = createMock<ExecutionContext>({
      switchToHttp: () => ({
        getRequest: () => ({
          headers: {
            'x-api-key': 'SECRET',
          },
        }),
      }),
    });

    const result = authGuard.canActivate(mockContext);
    expect(result).toBe(true);
  });

  it('should return false if the header does not contain the secret', () => {
    const mockContext = createMock<ExecutionContext>({
      switchToHttp: () => ({
        getRequest: () => ({
          headers: {
            'x-api-key': 'NOT_SECRET',
          },
        }),
      }),
    });

    const result = authGuard.canActivate(mockContext);
    expect(result).toBe(false);
  });

  it('should return false if the header does not exist', () => {
    const mockContext = createMock<ExecutionContext>({
      switchToHttp: () => ({
        getRequest: () => ({
          headers: {},
        }),
      }),
    });

    const result = authGuard.canActivate(mockContext);
    expect(result).toBe(false);
  });
});

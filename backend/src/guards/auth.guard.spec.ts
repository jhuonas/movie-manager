import { ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from './auth.guard';
import { Request } from 'express';

describe('AuthGuard', () => {
  let guard: AuthGuard;
  let mockExecutionContext: ExecutionContext;

  beforeEach(() => {
    guard = new AuthGuard();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(guard).toBeDefined();
  });

  describe('canActivate', () => {
    it('should return true for valid API token', () => {
      const mockRequest = {
        headers: {
          authorization: 'Bearer your-secret-token-here',
        },
      } as Request;

      mockExecutionContext = {
        switchToHttp: () => ({
          getRequest: () => mockRequest,
        }),
      } as ExecutionContext;

      const result = guard.canActivate(mockExecutionContext);

      expect(result).toBe(true);
    });

    it('should return true for valid API token from environment variable', () => {
      const originalEnv = process.env.API_SECRET;
      process.env.API_SECRET = 'custom-secret-token';

      const guardWithCustomSecret = new AuthGuard();

      const mockRequest = {
        headers: {
          authorization: 'Bearer custom-secret-token',
        },
      } as Request;

      mockExecutionContext = {
        switchToHttp: () => ({
          getRequest: () => mockRequest,
        }),
      } as ExecutionContext;

      const result = guardWithCustomSecret.canActivate(mockExecutionContext);

      expect(result).toBe(true);

      if (originalEnv) {
        process.env.API_SECRET = originalEnv;
      } else {
        delete process.env.API_SECRET;
      }
    });

    it('should throw UnauthorizedException when authorization header is missing', () => {
      const mockRequest = {
        headers: {},
      } as Request;

      mockExecutionContext = {
        switchToHttp: () => ({
          getRequest: () => mockRequest,
        }),
      } as ExecutionContext;

      expect(() => guard.canActivate(mockExecutionContext)).toThrow(UnauthorizedException);
      expect(() => guard.canActivate(mockExecutionContext)).toThrow('Authorization header is required');
    });

    it('should throw UnauthorizedException when authorization header is empty', () => {
      const mockRequest = {
        headers: {
          authorization: '',
        },
      } as Request;

      mockExecutionContext = {
        switchToHttp: () => ({
          getRequest: () => mockRequest,
        }),
      } as ExecutionContext;

      expect(() => guard.canActivate(mockExecutionContext)).toThrow(UnauthorizedException);
      expect(() => guard.canActivate(mockExecutionContext)).toThrow('Authorization header is required');
    });

    it('should throw UnauthorizedException for invalid API token', () => {
      const mockRequest = {
        headers: {
          authorization: 'Bearer invalid-token',
        },
      } as Request;

      mockExecutionContext = {
        switchToHttp: () => ({
          getRequest: () => mockRequest,
        }),
      } as ExecutionContext;

      expect(() => guard.canActivate(mockExecutionContext)).toThrow(UnauthorizedException);
      expect(() => guard.canActivate(mockExecutionContext)).toThrow('Invalid API token');
    });

    it('should throw UnauthorizedException when token format is incorrect', () => {
      const mockRequest = {
        headers: {
          authorization: 'your-secret-token-here',
        },
      } as Request;

      mockExecutionContext = {
        switchToHttp: () => ({
          getRequest: () => mockRequest,
        }),
      } as ExecutionContext;

      expect(() => guard.canActivate(mockExecutionContext)).toThrow(UnauthorizedException);
      expect(() => guard.canActivate(mockExecutionContext)).toThrow('Invalid API token');
    });

    it('should handle Bearer token with extra spaces', () => {
      const mockRequest = {
        headers: {
          authorization: 'Bearer  your-secret-token-here  ',
        },
      } as Request;

      mockExecutionContext = {
        switchToHttp: () => ({
          getRequest: () => mockRequest,
        }),
      } as ExecutionContext;

      const result = guard.canActivate(mockExecutionContext);

      expect(result).toBe(true);
    });
  });
}); 
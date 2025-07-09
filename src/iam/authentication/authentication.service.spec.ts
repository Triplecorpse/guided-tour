import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { AuthenticationService } from './authentication.service';
import { HashingService } from '../hashing.service';
import { RefreshTokenIdsStorage } from './refresh-token-ids.storage/refresh-token-ids.storage';
import { User } from '../User';
import { SignUpDTO } from './dto/sign-up-dto';
import { SignInDTO } from './dto/sign-in-dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { AuthException } from '../../auth-exception/AuthException';
import { AuthErrorType } from './enums/auth-error.enum';
import { UserPayload } from '../types/UserPayload';
import jwtConfig from '../config/jwt.config';

describe('AuthenticationService', () => {
  let service: AuthenticationService;
  let userRepository: Repository<User>;
  let hashingService: HashingService;
  let jwtService: JwtService;
  let refreshTokenIds: RefreshTokenIdsStorage;

  const mockUserRepository = {
    save: jest.fn(),
    findOneBy: jest.fn(),
    findOneByOrFail: jest.fn(),
  };

  const mockHashingService = {
    hash: jest.fn(),
    compare: jest.fn(),
  };

  const mockJwtService = {
    signAsync: jest.fn(),
    verifyAsync: jest.fn(),
  };

  const mockRefreshTokenIds = {
    insert: jest.fn(),
    validate: jest.fn(),
    invalidate: jest.fn(),
  };

  const mockJwtConfig = {
    accessTokenTtl: 3600,
    refreshTokenTtl: 86400,
    audience: 'test-audience',
    issuer: 'test-issuer',
    secret: 'test-secret',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthenticationService,
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
        {
          provide: HashingService,
          useValue: mockHashingService,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
        {
          provide: RefreshTokenIdsStorage,
          useValue: mockRefreshTokenIds,
        },
        {
          provide: jwtConfig.KEY,
          useValue: mockJwtConfig,
        },
      ],
    }).compile();

    service = module.get<AuthenticationService>(AuthenticationService);
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
    hashingService = module.get<HashingService>(HashingService);
    jwtService = module.get<JwtService>(JwtService);
    refreshTokenIds = module.get<RefreshTokenIdsStorage>(RefreshTokenIdsStorage);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('signUp', () => {
    it('should successfully create a new user', async () => {
      const signUpDto: SignUpDTO = {
        email: 'test@example.com',
        password: 'password123',
        full_name: 'Test User',
      };

      const hashedPassword = 'hashedPassword123';
      const user = {
        id: 1,
        email: signUpDto.email,
        full_name: signUpDto.full_name,
        password: hashedPassword,
        role: 'user',
      };

      mockHashingService.hash.mockResolvedValue(hashedPassword);
      mockUserRepository.save.mockResolvedValue(user);

      const result = await service.signUp(signUpDto);

      expect(mockHashingService.hash).toHaveBeenCalledWith(signUpDto.password);
      expect(mockUserRepository.save).toHaveBeenCalledWith(expect.objectContaining({
        email: signUpDto.email,
        full_name: signUpDto.full_name,
        password: hashedPassword,
      }));
      expect(result).toBe(true);
    });

    it('should throw AuthException for unique violation error', async () => {
      const signUpDto: SignUpDTO = {
        email: 'existing@example.com',
        password: 'password123',
        full_name: 'Test User',
      };

      const uniqueViolationError = {
        code: '23505',
        detail: 'Key (email)=(existing@example.com) already exists.',
      };

      mockHashingService.hash.mockResolvedValue('hashedPassword');
      mockUserRepository.save.mockRejectedValue(uniqueViolationError);

      await expect(service.signUp(signUpDto)).rejects.toThrow(AuthException);
    });

    it('should rethrow non-unique violation errors', async () => {
      const signUpDto: SignUpDTO = {
        email: 'test@example.com',
        password: 'password123',
        full_name: 'Test User',
      };

      const otherError = new Error('Database connection error');

      mockHashingService.hash.mockResolvedValue('hashedPassword');
      mockUserRepository.save.mockRejectedValue(otherError);

      await expect(service.signUp(signUpDto)).rejects.toThrow(otherError);
    });
  });

  describe('signIn', () => {
    it('should successfully authenticate user and return tokens', async () => {
      const signInDto: SignInDTO = {
        email: 'test@example.com',
        password: 'password123',
      };

      const user = {
        id: 1,
        email: 'test@example.com',
        password: 'hashedPassword',
        full_name: 'Test User',
        role: 'user' as any,
      };

      const tokens = {
        accessToken: 'access-token',
        refreshToken: 'refresh-token',
      };

      mockUserRepository.findOneBy.mockResolvedValue(user);
      mockHashingService.compare.mockResolvedValue(true);
      jest.spyOn(service, 'generateTokens').mockResolvedValue(tokens);

      const result = await service.signIn(signInDto);

      expect(mockUserRepository.findOneBy).toHaveBeenCalledWith({ email: signInDto.email });
      expect(mockHashingService.compare).toHaveBeenCalledWith(signInDto.password, user.password);
      expect(result).toEqual(tokens);
    });

    it('should throw AuthException when user not found', async () => {
      const signInDto: SignInDTO = {
        email: 'nonexistent@example.com',
        password: 'password123',
      };

      mockUserRepository.findOneBy.mockResolvedValue(null);

      await expect(service.signIn(signInDto)).rejects.toThrow(AuthException);
    });

    it('should throw AuthException when password is incorrect', async () => {
      const signInDto: SignInDTO = {
        email: 'test@example.com',
        password: 'wrongpassword',
      };

      const user = {
        id: 1,
        email: 'test@example.com',
        password: 'hashedPassword',
        full_name: 'Test User',
        role: 'user' as any,
      };

      mockUserRepository.findOneBy.mockResolvedValue(user);
      mockHashingService.compare.mockResolvedValue(false);

      await expect(service.signIn(signInDto)).rejects.toThrow(AuthException);
    });
  });

  describe('generateTokens', () => {
    it('should generate access and refresh tokens', async () => {
      const user = {
        id: 1,
        email: 'test@example.com',
        password: 'hashedPassword',
        full_name: 'Test User',
        role: 'user' as any,
      };

      const accessToken = 'access-token';
      const refreshToken = 'refresh-token';

      mockJwtService.signAsync
        .mockResolvedValueOnce(accessToken)
        .mockResolvedValueOnce(refreshToken);
      mockRefreshTokenIds.insert.mockResolvedValue(undefined);

      const result = await service.generateTokens(user);

      expect(mockJwtService.signAsync).toHaveBeenCalledTimes(2);
      expect(mockRefreshTokenIds.insert).toHaveBeenCalled();
      expect(result).toEqual({
        accessToken,
        refreshToken,
      });
    });
  });

  describe('refreshTokens', () => {
    it('should successfully refresh tokens', async () => {
      const refreshTokenDto: RefreshTokenDto = {
        refreshToken: 'valid-refresh-token',
      };

      const payload = {
        sub: 1,
        refreshTokenId: 'refresh-token-id',
      };

      const user = {
        id: 1,
        email: 'test@example.com',
        password: 'hashedPassword',
        full_name: 'Test User',
        role: 'user' as any,
      };

      const newTokens = {
        accessToken: 'new-access-token',
        refreshToken: 'new-refresh-token',
      };

      mockJwtService.verifyAsync.mockResolvedValue(payload);
      mockUserRepository.findOneByOrFail.mockResolvedValue(user);
      mockRefreshTokenIds.validate.mockResolvedValue(true);
      mockRefreshTokenIds.invalidate.mockResolvedValue(undefined);
      jest.spyOn(service, 'generateTokens').mockResolvedValue(newTokens);

      const result = await service.refreshTokens(refreshTokenDto);

      expect(mockJwtService.verifyAsync).toHaveBeenCalledWith(refreshTokenDto.refreshToken, {
        secret: mockJwtConfig.secret,
        audience: mockJwtConfig.audience,
        issuer: mockJwtConfig.issuer,
      });
      expect(mockUserRepository.findOneByOrFail).toHaveBeenCalledWith({ id: payload.sub });
      expect(mockRefreshTokenIds.validate).toHaveBeenCalledWith(payload.sub, payload.refreshTokenId);
      expect(mockRefreshTokenIds.invalidate).toHaveBeenCalledWith(payload.sub);
      expect(result).toEqual(newTokens);
    });

    it('should throw AuthException when refresh token is invalid', async () => {
      const refreshTokenDto: RefreshTokenDto = {
        refreshToken: 'invalid-refresh-token',
      };

      mockJwtService.verifyAsync.mockRejectedValue(new Error('Invalid token'));

      await expect(service.refreshTokens(refreshTokenDto)).rejects.toThrow(AuthException);
    });

    it('should throw AuthException when refresh token is not valid in storage', async () => {
      const refreshTokenDto: RefreshTokenDto = {
        refreshToken: 'valid-refresh-token',
      };

      const payload = {
        sub: 1,
        refreshTokenId: 'refresh-token-id',
      };

      const user = {
        id: 1,
        email: 'test@example.com',
        password: 'hashedPassword',
        full_name: 'Test User',
        role: 'user' as any,
      };

      mockJwtService.verifyAsync.mockResolvedValue(payload);
      mockUserRepository.findOneByOrFail.mockResolvedValue(user);
      mockRefreshTokenIds.validate.mockResolvedValue(false);

      await expect(service.refreshTokens(refreshTokenDto)).rejects.toThrow(AuthException);
    });
  });

  describe('getUserById', () => {
    it('should return user when valid access token is provided', async () => {
      const accessToken = 'valid-access-token';
      const payload = { sub: 1 };
      const user = {
        id: 1,
        email: 'test@example.com',
        password: 'hashedPassword',
        full_name: 'Test User',
        role: 'user' as any,
      };

      mockJwtService.verifyAsync.mockResolvedValue(payload);
      mockUserRepository.findOneBy.mockResolvedValue(user);

      const result = await service.getUserById(accessToken);

      expect(mockJwtService.verifyAsync).toHaveBeenCalledWith(accessToken, {
        secret: mockJwtConfig.secret,
        audience: mockJwtConfig.audience,
        issuer: mockJwtConfig.issuer,
      });
      expect(mockUserRepository.findOneBy).toHaveBeenCalledWith({ id: payload.sub });
      expect(result).toEqual(user);
    });

    it('should return null when user not found', async () => {
      const accessToken = 'valid-access-token';
      const payload = { sub: 1 };

      mockJwtService.verifyAsync.mockResolvedValue(payload);
      mockUserRepository.findOneBy.mockResolvedValue(null);

      const result = await service.getUserById(accessToken);

      expect(result).toBeNull();
    });

    it('should throw error when access token is invalid', async () => {
      const accessToken = 'invalid-access-token';

      mockJwtService.verifyAsync.mockRejectedValue(new Error('Invalid token'));

      await expect(service.getUserById(accessToken)).rejects.toThrow();
    });
  });
});

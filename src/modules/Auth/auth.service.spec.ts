import { UnauthorizedException } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcrypt";
import { AuthService } from "./auth.service";
import { UserService } from "../User/user.service";
import { UserType, UserStatus } from "../User/enums/user.enum";

jest.mock('bcrypt', () => ({
  __esModule: true,
  compare: jest.fn(),
  hash: jest.fn(),
}));

describe('AuthService', () => {
  let service: AuthService;
  let userService: { findByEmail: jest.Mock };
  let jwtService: { signAsync: jest.Mock };

  beforeEach(async () => {
    userService = { findByEmail: jest.fn() };
    jwtService = { signAsync: jest.fn() };

    const moduleRef = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UserService, useValue: userService },
        { provide: JwtService, useValue: jwtService },
      ],
    }).compile();

    service = moduleRef.get(AuthService);
  });

  afterEach(() => {
    jest.restoreAllMocks();
    jest.clearAllMocks();
  });

  it('logs in an active user with valid password', async () => {
    const user = {
      id: 1,
      email: 'user@example.com',
      name: 'User',
      password: 'hashed-password',
      userType: UserType.GUARDIAN,
      status: UserStatus.ACTIVE,
    };
    userService.findByEmail.mockResolvedValue(user as never);
    (bcrypt.compare as jest.Mock).mockResolvedValue(true);
    jwtService.signAsync.mockResolvedValue('token');

    const result = await service.login({ email: user.email, password: 'secret' });

    expect(userService.findByEmail).toHaveBeenCalledWith(user.email);
    expect(jwtService.signAsync).toHaveBeenCalledWith({
      sub: user.id,
      email: user.email,
      name: user.name,
      userType: user.userType,
    });
    expect(result).toEqual({
      access_token: 'token',
      user: {
        userType: user.userType,
        id: user.id,
        name: user.name,
        email: user.email,
      },
    });
  });

  it('rejects inactive users', async () => {
    userService.findByEmail.mockResolvedValue({
      id: 1,
      email: 'user@example.com',
      name: 'User',
      password: 'hashed-password',
      userType: UserType.GUARDIAN,
      status: UserStatus.INACTIVE,
    } as never);

    await expect(service.login({ email: 'user@example.com', password: 'secret' })).rejects.toBeInstanceOf(UnauthorizedException);
  });

  it('rejects invalid credentials when the password does not match', async () => {
    userService.findByEmail.mockResolvedValue({
      id: 1,
      email: 'user@example.com',
      name: 'User',
      password: 'hashed-password',
      userType: UserType.GUARDIAN,
      status: UserStatus.ACTIVE,
    } as never);
    (bcrypt.compare as jest.Mock).mockResolvedValue(false);

    await expect(service.login({ email: 'user@example.com', password: 'wrong' })).rejects.toBeInstanceOf(UnauthorizedException);
  });
});
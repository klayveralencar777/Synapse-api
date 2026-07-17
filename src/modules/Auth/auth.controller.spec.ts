import { Test } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

describe('AuthController', () => {
  let controller: AuthController;

  let authService: {
    login: jest.Mock;
  };


  beforeEach(async () => {
    authService = {
      login: jest.fn(),
    };


    const moduleRef = await Test.createTestingModule({
      controllers: [
        AuthController,
      ],
      providers: [
        {
          provide: AuthService,
          useValue: authService,
        },
      ],
    }).compile();


    controller = moduleRef.get<AuthController>(
      AuthController,
    );
  });


  afterEach(() => {
    jest.clearAllMocks();
  });


  it('should be defined', () => {
    expect(controller).toBeDefined();
  });


  it('should login user', async () => {
    const dto = {
      email: 'user@email.com',
      password: '123456',
    };


    const response = {
      accessToken: 'jwt-token',
      user: {
        id: 1,
        email: 'user@email.com',
      },
    };


    authService.login.mockResolvedValue(response);


    const result = await controller.login(dto);


    expect(authService.login)
      .toHaveBeenCalledWith(dto);


    expect(result)
      .toEqual(response);
  });


  it('should throw error when login fails', async () => {
    const dto = {
      email: 'user@email.com',
      password: 'wrong-password',
    };


    authService.login.mockRejectedValue(
      new Error('Invalid credentials'),
    );


    await expect(
      controller.login(dto),
    )
      .rejects
      .toThrow('Invalid credentials');


    expect(authService.login)
      .toHaveBeenCalledWith(dto);
  });

});
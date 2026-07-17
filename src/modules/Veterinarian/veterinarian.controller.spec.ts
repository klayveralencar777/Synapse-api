import { Test } from '@nestjs/testing';
import { VeterinarianController } from './veterinarian.controller';
import { VeterinarianService } from './veterinarian.service';
import { UserService } from '../User/user.service';
import { UserType } from '../User/enums/user.enum';

describe('VeterinarianController', () => {
  let controller: VeterinarianController;

  let veterinarianService: {
    findAll: jest.Mock;
    findById: jest.Mock;
    save: jest.Mock;
    update: jest.Mock;
    delete: jest.Mock;
  };

  let userService: {
    changePassword: jest.Mock;
    deleteMyAccount: jest.Mock;
  };


  beforeEach(async () => {
    veterinarianService = {
      findAll: jest.fn(),
      findById: jest.fn(),
      save: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    userService = {
      changePassword: jest.fn(),
      deleteMyAccount: jest.fn(),
    };


    const moduleRef = await Test.createTestingModule({
      controllers: [
        VeterinarianController,
      ],
      providers: [
        {
          provide: VeterinarianService,
          useValue: veterinarianService,
        },
        {
          provide: UserService,
          useValue: userService,
        },
      ],
    }).compile();


    controller = moduleRef.get<VeterinarianController>(
      VeterinarianController,
    );
  });


  afterEach(() => {
    jest.clearAllMocks();
  });


  it('should be defined', () => {
    expect(controller).toBeDefined();
  });


  it('should return all veterinarians', async () => {
    const veterinarians = [
      {
        id: 1,
        name: 'Dr João',
      },
    ];

    veterinarianService.findAll.mockResolvedValue(veterinarians);


    const result = await controller.findAll();


    expect(veterinarianService.findAll)
      .toHaveBeenCalled();

    expect(result)
      .toEqual(veterinarians);
  });


  it('should return veterinarian by id', async () => {
    const veterinarian = {
      id: 1,
      name: 'Dr João',
    };


    veterinarianService.findById.mockResolvedValue(veterinarian);


    const result = await controller.findById('1');


    expect(veterinarianService.findById)
      .toHaveBeenCalledWith(1);

    expect(result)
      .toEqual(veterinarian);
  });


  it('should create a veterinarian', async () => {
    const dto = {
      name: 'Dr João',
      email: 'joao@email.com',
      password: '123456',
      cpf: '12345678900',
      cnpj: '12345678000199',
      crmv: '12345',
      address: 'Rua A',
    };


    const veterinarian = {
      id: 1,
      ...dto,
    };


    veterinarianService.save.mockResolvedValue(veterinarian);


    const result = await controller.create(dto);


    expect(veterinarianService.save)
      .toHaveBeenCalledWith(dto);


    expect(result)
      .toEqual(veterinarian);
  });


  it('should update logged veterinarian', async () => {
    const user = {
      id: 1,
      name: 'Dr João',
      email: 'joao@email.com',
      type: UserType.VETERINARIAN,
    };


    const dto = {
      name: 'Dr João Silva',
    };


    const updated = {
      id: 1,
      ...dto,
    };


    veterinarianService.update.mockResolvedValue(updated);


    const result = await controller.update(
      user,
      dto,
    );


    expect(veterinarianService.update)
      .toHaveBeenCalledWith(
        user.id,
        dto,
      );


    expect(result)
      .toEqual(updated);
  });


  it('should change veterinarian password', async () => {
    const user = {
      id: 1,
      name: 'Dr João',
      email: 'joao@email.com',
      type: UserType.VETERINARIAN,
    };


    const dto = {
      password: '123456',
      newPassword: '654321',
    };


    userService.changePassword.mockResolvedValue({
      message: 'Password changed',
    });


    const result = await controller.changePassword(
      user,
      dto,
    );


    expect(userService.changePassword)
      .toHaveBeenCalledWith(
        user.id,
        dto,
      );


    expect(result)
      .toEqual({
        message: 'Password changed',
      });
  });


  it('should delete logged veterinarian account', async () => {
    const user = {
      id: 1,
      name: 'Dr João',
      email: 'joao@email.com',
      type: UserType.VETERINARIAN,
    };


    userService.deleteMyAccount.mockResolvedValue({
      message: 'Account deleted',
    });


    const result = await controller.deleteMyAccount(user);


    expect(userService.deleteMyAccount)
      .toHaveBeenCalledWith(user.id);


    expect(result)
      .toEqual({
        message: 'Account deleted',
      });
  });


  it('should delete veterinarian by id', async () => {

    veterinarianService.delete.mockResolvedValue(undefined);


     controller.delete(1);


    expect(veterinarianService.delete)
      .toHaveBeenCalledWith(1);
  });

});
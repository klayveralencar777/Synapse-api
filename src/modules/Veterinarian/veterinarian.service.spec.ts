import { NotFoundException } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";
import { VeterinarianService } from "./veterinarian.service";
import { Veterinarian } from "./entities/veterinarian.entity";
import { UserService } from "../User/user.service";

describe('VeterinarianService', () => {
  let service: VeterinarianService;

  let repository: {
    find: jest.Mock;
    findOne: jest.Mock;
    create: jest.Mock;
    save: jest.Mock;
    merge: jest.Mock;
    delete: jest.Mock;
  };

  let userService: {
    ensureIsEmailAvailable: jest.Mock;
    ensureIsCpfAvailable: jest.Mock;
    encryptPassword: jest.Mock;
    findById: jest.Mock;
  };

  beforeEach(async () => {
    repository = {
      find: jest.fn(),
      findOne: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
      merge: jest.fn(),
      delete: jest.fn(),
    };

    userService = {
      ensureIsEmailAvailable: jest.fn(),
      ensureIsCpfAvailable: jest.fn(),
      encryptPassword: jest.fn(),
      findById: jest.fn(),
    };

    const moduleRef = await Test.createTestingModule({
      providers: [
        VeterinarianService,
        {
          provide: getRepositoryToken(Veterinarian),
          useValue: repository,
        },
        {
          provide: UserService,
          useValue: userService,
        },
      ],
    }).compile();

    service = moduleRef.get<VeterinarianService>(VeterinarianService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('returns all veterinarians', async () => {
    repository.find.mockResolvedValue([{ id: 1 }] as Veterinarian[]);

    await expect(service.findAll())
      .resolves
      .toEqual([{ id: 1 }]);
  });

  it('returns a veterinarian by id', async () => {
    repository.findOne.mockResolvedValue({
      id: 1,
      name: 'Vet',
    } as Veterinarian);

    await expect(service.findById(1))
      .resolves
      .toEqual({
        id: 1,
        name: 'Vet',
      });
  });

  it('throws when veterinarian is not found by id', async () => {
    repository.findOne.mockResolvedValue(null);

    await expect(service.findById(1))
      .rejects
      .toBeInstanceOf(NotFoundException);
  });

  it('saves a veterinarian after validating email/cpf/cnpj and hashing password', async () => {
    userService.encryptPassword.mockResolvedValue('hashed-password');

    repository.create.mockReturnValue({
      id: 1,
    } as Veterinarian);

    repository.save.mockResolvedValue({
      id: 1,
      name: 'Vet',
    } as Veterinarian);

    const result = await service.save({
      name: 'Vet',
      email: 'vet@example.com',
      password: 'secret',
      cpf: '12345678901',
      crmv: '12345',
      cnpj: '12345678000199',
      address: 'Street 1',
    });

    expect(userService.ensureIsEmailAvailable)
      .toHaveBeenCalledWith('vet@example.com');

    expect(userService.ensureIsCpfAvailable)
      .toHaveBeenCalledWith('12345678901');

    expect(userService.encryptPassword)
      .toHaveBeenCalledWith('secret');

    expect(repository.create)
      .toHaveBeenCalledWith({
        name: 'Vet',
        email: 'vet@example.com',
        password: 'hashed-password',
        cpf: '12345678901',
        crmv: '12345',
        cnpj: '12345678000199',
        address: 'Street 1',
      });

    expect(result).toEqual({
      id: 1,
      name: 'Vet',
    });
  });

  it('updates a veterinarian and validates only provided fields', async () => {
    const veterinarian = {
      id: 1,
      name: 'Vet',
    } as Veterinarian;

    repository.findOne.mockResolvedValue(veterinarian);

    repository.save.mockResolvedValue({
      id: 1,
      name: 'Vet Updated',
    } as Veterinarian);

    const result = await service.update(1, {
      name: 'Vet Updated',
      cnpj: '12345678000199',
    });

    expect(userService.ensureIsEmailAvailable)
      .not
      .toHaveBeenCalled();

    expect(userService.ensureIsCpfAvailable)
      .not
      .toHaveBeenCalled();

    expect(repository.merge)
      .toHaveBeenCalledWith(veterinarian, {
        name: 'Vet Updated',
        cnpj: '12345678000199',
      });

    expect(result).toEqual({
      id: 1,
      name: 'Vet Updated',
    });
  });

  it('deletes a veterinarian after confirming the user exists', async () => {
    userService.findById.mockResolvedValue({
      id: 1,
    });

    repository.delete.mockResolvedValue({
      affected: 1,
    });

    await expect(service.delete(1))
      .resolves
      .toBeUndefined();

    expect(repository.delete)
      .toHaveBeenCalledWith(1);
  });

  it('throws when the veterinarian entity is missing', async () => {
    repository.findOne.mockResolvedValue(null);

    await expect(service.findEntityById(1))
      .rejects
      .toBeInstanceOf(NotFoundException);
  });
});
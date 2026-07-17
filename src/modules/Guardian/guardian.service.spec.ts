import { NotFoundException } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { GuardianService } from "./guardian.service";
import { Guardian } from "./entities/guardian.entity";
import { UserService } from "../User/user.service";

describe('GuardianService', () => {
  let service: GuardianService;
  let repository: jest.Mocked<Partial<Repository<Guardian>>>;
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
        GuardianService,
        { provide: getRepositoryToken(Guardian), useValue: repository },
        { provide: UserService, useValue: userService },
      ],
    }).compile();

    service = moduleRef.get(GuardianService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('returns all guardians', async () => {
    (repository.find as jest.Mock).mockResolvedValue([{ id: 1 }] as Guardian[]);

    await expect(service.findAll()).resolves.toEqual([{ id: 1 }]);
  });

  it('returns a guardian by id', async () => {
    (repository.findOne as jest.Mock).mockResolvedValue({ id: 1, name: 'Guardian' } as Guardian);

    await expect(service.findById(1)).resolves.toEqual({ id: 1, name: 'Guardian' });
  });

  it('throws when guardian is not found by id', async () => {
    (repository.findOne as jest.Mock).mockResolvedValue(null);

    await expect(service.findById(1)).rejects.toBeInstanceOf(NotFoundException);
  });

  it('saves a guardian after validating email/cpf and hashing password', async () => {
    (userService.encryptPassword as jest.Mock).mockResolvedValue('hashed-password');
    (repository.create as jest.Mock).mockReturnValue({ id: 1 } as Guardian);
    (repository.save as jest.Mock).mockResolvedValue({ id: 1, name: 'Guardian' } as Guardian);

    const result = await service.save({
      name: 'Guardian',
      email: 'guardian@example.com',
      password: 'secret',
      cpf: '12345678901',
      phone: '999999999',
    });

    expect(userService.ensureIsEmailAvailable).toHaveBeenCalledWith('guardian@example.com');
    expect(userService.ensureIsCpfAvailable).toHaveBeenCalledWith('12345678901');
    expect(userService.encryptPassword).toHaveBeenCalledWith('secret');
    expect(repository.create).toHaveBeenCalledWith({
      name: 'Guardian',
      email: 'guardian@example.com',
      password: 'hashed-password',
      cpf: '12345678901',
      phone: '999999999',
    });
    expect(result).toEqual({ id: 1, name: 'Guardian' });
  });

  it('updates a guardian and validates only provided fields', async () => {
    const guardian = { id: 1, name: 'Guardian' } as Guardian;
    (repository.findOne as jest.Mock).mockResolvedValue(guardian);
    (repository.save as jest.Mock).mockResolvedValue({ id: 1, name: 'Guardian Updated' } as Guardian);

    const result = await service.update(1, {
      name: 'Guardian Updated',
      email: 'updated@example.com',
    });

    expect(userService.ensureIsEmailAvailable).toHaveBeenCalledWith('updated@example.com', 1);
    expect(userService.ensureIsCpfAvailable).not.toHaveBeenCalled();
    expect(repository.merge).toHaveBeenCalledWith(guardian, {
      name: 'Guardian Updated',
      email: 'updated@example.com',
    });
    expect(result).toEqual({ id: 1, name: 'Guardian Updated' });
  });

  it('deletes a guardian after confirming the user exists', async () => {
    (userService.findById as jest.Mock).mockResolvedValue({ id: 1 } as never);
    (repository.delete as jest.Mock).mockResolvedValue({ affected: 1 } as never);

    await expect(service.delete(1)).resolves.toBeUndefined();
    expect(repository.delete).toHaveBeenCalledWith(1);
  });

  it('throws when the guardian entity is missing', async () => {
    (repository.findOne as jest.Mock).mockResolvedValue(null);

    await expect(service.findEntityById(1)).rejects.toBeInstanceOf(NotFoundException);
  });
});
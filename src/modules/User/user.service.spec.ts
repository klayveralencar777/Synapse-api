import { BadRequestException, ConflictException, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";
import * as bcrypt from "bcrypt";
import { Repository } from "typeorm";
import { UserService } from "./user.service";
import { User } from "./entities/user.entity";
import { UserStatus } from "./enums/user.enum";

jest.mock('bcrypt', () => ({
  __esModule: true,
  compare: jest.fn(),
  hash: jest.fn(),
}));

describe('UserService', () => {
  let service: UserService;
  let repository: jest.Mocked<Partial<Repository<User>>>;

  beforeEach(async () => {
    repository = {
      findOne: jest.fn(),
      save: jest.fn(),
    };

    const moduleRef = await Test.createTestingModule({
      providers: [
        UserService,
        { provide: getRepositoryToken(User), useValue: repository },
      ],
    }).compile();

    service = moduleRef.get(UserService);
  });

  afterEach(() => {
    jest.restoreAllMocks();
    jest.clearAllMocks();
  });

  it('finds a user by id', async () => {
    (repository.findOne as jest.Mock).mockResolvedValue({ id: 1 } as User);

    await expect(service.findById(1)).resolves.toEqual({ id: 1 });
    expect(repository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
  });

  it('throws when a user by id does not exist', async () => {
    (repository.findOne as jest.Mock).mockResolvedValue(null);

    await expect(service.findById(1)).rejects.toBeInstanceOf(NotFoundException);
  });

  it('finds a user by email', async () => {
    (repository.findOne as jest.Mock).mockResolvedValue({ id: 1, email: 'user@example.com' } as User);

    await expect(service.findByEmail('user@example.com')).resolves.toEqual({ id: 1, email: 'user@example.com' });
    expect(repository.findOne).toHaveBeenCalledWith({ where: { email: 'user@example.com' } });
  });

  it('deactivates the current account', async () => {
    jest.spyOn(service, 'findById').mockResolvedValue({ id: 1, status: UserStatus.ACTIVE } as User);
    (repository.save as jest.Mock).mockImplementation(async user => user as User);

    const result = await service.deleteMyAccount(1);

    expect(result.status).toBe(UserStatus.INACTIVE);
    expect(repository.save).toHaveBeenCalledWith(expect.objectContaining({ id: 1, status: UserStatus.INACTIVE }));
  });

  it('changes the password when current password matches and new password differs', async () => {
    jest.spyOn(service, 'findById').mockResolvedValue({ id: 1, password: 'hashed-password' } as User);
    (bcrypt.compare as jest.Mock)
      .mockResolvedValueOnce(true)
      .mockResolvedValueOnce(false);
    (bcrypt.hash as jest.Mock).mockResolvedValue('new-hashed-password');
    (repository.save as jest.Mock).mockResolvedValue({ id: 1, password: 'new-hashed-password' } as User);

    await expect(service.changePassword(1, { password: 'old', newPassword: 'new' })).resolves.toBeUndefined();

    expect(repository.save).toHaveBeenCalledWith(expect.objectContaining({ password: 'new-hashed-password' }));
  });

  it('rejects incorrect current password', async () => {
    jest.spyOn(service, 'findById').mockResolvedValue({ id: 1, password: 'hashed-password' } as User);
    (bcrypt.compare as jest.Mock)
      .mockResolvedValueOnce(false)
      .mockResolvedValueOnce(false);

    await expect(service.changePassword(1, { password: 'wrong', newPassword: 'new' })).rejects.toBeInstanceOf(UnauthorizedException);
  });

  it('rejects when the new password is the same as the current password', async () => {
    jest.spyOn(service, 'findById').mockResolvedValue({ id: 1, password: 'hashed-password' } as User);
    (bcrypt.compare as jest.Mock)
      .mockResolvedValueOnce(true)
      .mockResolvedValueOnce(true);

    await expect(service.changePassword(1, { password: 'same', newPassword: 'same' })).rejects.toBeInstanceOf(BadRequestException);
  });

  it('throws when email is already taken by another user', async () => {
    (repository.findOne as jest.Mock).mockResolvedValue({ id: 2, email: 'taken@example.com' } as User);

    await expect(service.ensureIsEmailAvailable('taken@example.com', 1)).rejects.toBeInstanceOf(ConflictException);
  });

  it('allows email when it belongs to the same user id', async () => {
    (repository.findOne as jest.Mock).mockResolvedValue({ id: 1, email: 'taken@example.com' } as User);

    await expect(service.ensureIsEmailAvailable('taken@example.com', 1)).resolves.toBeUndefined();
  });

  it('throws when cpf is already taken by another user', async () => {
    (repository.findOne as jest.Mock).mockResolvedValue({ id: 2, cpf: '12345678901' } as User);

    await expect(service.ensureIsCpfAvailable('12345678901', 1)).rejects.toBeInstanceOf(ConflictException);
  });

  it('encrypts passwords with bcrypt', async () => {
    (bcrypt.hash as jest.Mock).mockResolvedValue('hashed');

    await expect(service.encryptPassword('secret')).resolves.toBe('hashed');
  });
});
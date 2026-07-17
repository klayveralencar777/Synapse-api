import { BadRequestException } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";
import { AppointmentService } from "./appointment.service";
import { Appointment } from "./entities/appointment.entity";
import { GuardianService } from "../Guardian/guardian.service";
import { VeterinarianService } from "../Veterinarian/veterinarian.service";
import { UserService } from "../User/user.service";
import { UserType } from "../User/enums/user.enum";
import { AppointmentStatus } from "./enums/appointment.enum";

describe('AppointmentService', () => {
  let service: AppointmentService;

  let repository: {
    find: jest.Mock;
    create: jest.Mock;
    save: jest.Mock;
  };

  let guardianService: {
    findEntityById: jest.Mock;
  };

  let veterinarianService: {
    findEntityById: jest.Mock;
  };

  let userService: {
    findById: jest.Mock;
  };

  beforeEach(async () => {
    repository = {
      find: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
    };

    guardianService = {
      findEntityById: jest.fn(),
    };

    veterinarianService = {
      findEntityById: jest.fn(),
    };

    userService = {
      findById: jest.fn(),
    };

    const moduleRef = await Test.createTestingModule({
      providers: [
        AppointmentService,
        {
          provide: getRepositoryToken(Appointment),
          useValue: repository,
        },
        {
          provide: GuardianService,
          useValue: guardianService,
        },
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

    service = moduleRef.get<AppointmentService>(AppointmentService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('returns appointments converted to response DTOs', async () => {
    const appointments = [
      {
        id: 1,
        scheduledAt: new Date('2026-01-01T10:00:00.000Z'),
        reason: 'Consulta',
        status: AppointmentStatus.SCHEDULED,
        guardianId: 11,
        veterinarianId: 22,
        createdAt: new Date('2026-01-01T09:00:00.000Z'),
        updatedAt: new Date('2026-01-01T09:30:00.000Z'),
      },
    ] as Appointment[];

    repository.find.mockResolvedValue(appointments);

    const result = await service.findAll();

    expect(repository.find).toHaveBeenCalledWith();
    expect(result).toEqual(appointments);
  });

  it('returns guardian appointments for guardian users', async () => {
    const user = {
      id: 1,
      userType: UserType.GUARDIAN,
    };

    const appointments = [
      {
        id: 10,
        reason: 'Vacina',
      },
    ] as Appointment[];

    userService.findById.mockResolvedValue(user);
    repository.find.mockResolvedValue(appointments);

    const result = await service.findMyAppointments(1);

    expect(userService.findById)
      .toHaveBeenCalledWith(1);

    expect(repository.find)
      .toHaveBeenCalledWith({
        where: {
          guardian: {
            id: 1,
          },
        },
      });

    expect(result).toEqual(appointments);
  });

  it('returns veterinarian appointments for veterinarian users', async () => {
    const user = {
      id: 2,
      userType: UserType.VETERINARIAN,
    };

    const appointments = [
      {
        id: 20,
        reason: 'Retorno',
      },
    ] as Appointment[];

    userService.findById.mockResolvedValue(user);
    repository.find.mockResolvedValue(appointments);

    const result = await service.findMyAppointments(2);

    expect(userService.findById)
      .toHaveBeenCalledWith(2);

    expect(repository.find)
      .toHaveBeenCalledWith({
        where: {
          veterinarian: {
            id: 2,
          },
        },
      });

    expect(result).toEqual(appointments);
  });

  it('throws when the user type is invalid', async () => {
    userService.findById.mockResolvedValue({
      id: 3,
      userType: 'admin',
    });

    await expect(service.findMyAppointments(3))
      .rejects
      .toBeInstanceOf(BadRequestException);
  });

  it('creates and saves an appointment with guardian and veterinarian relations', async () => {
    const guardian = {
      id: 11,
    };

    const veterinarian = {
      id: 22,
    };

    const dto = {
      scheduledAt: '2026-01-01T10:00:00.000Z',
      reason: 'Consulta',
      petInformation: 'Cachorro',
      veterinarianId: 22,
    };

    const createdAppointment = {
      scheduledAt: new Date(dto.scheduledAt),
      reason: dto.reason,
      petInformation: dto.petInformation,
      guardian,
      veterinarian,
      status: AppointmentStatus.SCHEDULED,
    } as Appointment;

    const savedAppointment = {
      id: 1,
      scheduledAt: new Date(dto.scheduledAt),
      reason: dto.reason,
      petInformation: dto.petInformation,
      guardian,
      veterinarian,
      guardianId: 11,
      veterinarianId: 22,
      status: AppointmentStatus.SCHEDULED,
      createdAt: new Date('2026-01-01T09:00:00.000Z'),
      updatedAt: new Date('2026-01-01T09:30:00.000Z'),
    } as Appointment;

    guardianService.findEntityById.mockResolvedValue(guardian);

    veterinarianService.findEntityById.mockResolvedValue(veterinarian);

    repository.create.mockReturnValue(createdAppointment);

    repository.save.mockResolvedValue(savedAppointment);

    const result = await service.save(11, dto);

    expect(guardianService.findEntityById)
      .toHaveBeenCalledWith(11);

    expect(veterinarianService.findEntityById)
      .toHaveBeenCalledWith(22);

    expect(repository.create)
      .toHaveBeenCalledWith({
        ...dto,
        guardian,
        veterinarian,
      });

    expect(repository.save)
      .toHaveBeenCalledWith(createdAppointment);

    expect(result).toMatchObject({
      id: 1,
      reason: 'Consulta',
      status: AppointmentStatus.SCHEDULED,
      veterinarianId: 22,
    });
  });
});
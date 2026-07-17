import { Test } from '@nestjs/testing';
import { AppointmentController } from './appointment.controller';
import { AppointmentService } from './appointment.service';
import { UserType } from '../User/enums/user.enum';

describe('AppointmentController', () => {
  let controller: AppointmentController;

  let appointmentService: {
    findAll: jest.Mock;
    findMyAppointments: jest.Mock;
    save: jest.Mock;
  };


  beforeEach(async () => {
    appointmentService = {
      findAll: jest.fn(),
      findMyAppointments: jest.fn(),
      save: jest.fn(),
    };


    const moduleRef = await Test.createTestingModule({
      controllers: [
        AppointmentController,
      ],
      providers: [
        {
          provide: AppointmentService,
          useValue: appointmentService,
        },
      ],
    }).compile();


    controller = moduleRef.get<AppointmentController>(
      AppointmentController,
    );
  });


  afterEach(() => {
    jest.clearAllMocks();
  });


  it('should be defined', () => {
    expect(controller).toBeDefined();
  });


  it('should return all appointments', async () => {
    const appointments = [
      {
        id: 1,
        reason: 'Consulta',
      },
    ];


    appointmentService.findAll.mockResolvedValue(
      appointments,
    );


    const result = await controller.findAll();


    expect(appointmentService.findAll)
      .toHaveBeenCalled();


    expect(result)
      .toEqual(appointments);
  });


  it('should return logged user appointments', async () => {
    const user = {
      id: 10,
      name: 'Maria',
      email: 'maria@email.com',
      type: UserType.GUARDIAN,
    };


    const appointments = [
      {
        id: 1,
        reason: 'Vacina',
      },
    ];


    appointmentService.findMyAppointments
      .mockResolvedValue(appointments);


    const result = await controller.findMyAppointments(
      user,
    );


    expect(appointmentService.findMyAppointments)
      .toHaveBeenCalledWith(user.id);


    expect(result)
      .toEqual(appointments);
  });


  it('should create appointment for logged guardian', async () => {
    const user = {
      id: 10,
      name: 'Maria',
      email: 'maria@email.com',
      type: UserType.GUARDIAN,
    };


    const dto = {
      scheduledAt: '2026-01-01T10:00:00.000Z',
      reason: 'Consulta',
      petInformation: 'Cachorro',
      veterinarianId: 5,
    };


    const appointment = {
      id: 1,
      ...dto,
      guardianId: user.id,
    };


    appointmentService.save
      .mockResolvedValue(appointment);


    const result = await controller.create(
      user,
      dto,
    );


    expect(appointmentService.save)
      .toHaveBeenCalledWith(
        user.id,
        dto,
      );


    expect(result)
      .toEqual(appointment);
  });


  it('should propagate service error when creating appointment fails', async () => {
    const user = {
      id: 10,
      name: 'Maria',
      email: 'maria@email.com',
      type: UserType.GUARDIAN,
    };


    const dto = {
      scheduledAt: '2026-01-01T10:00:00.000Z',
      reason: 'Consulta',
      petInformation: 'Cachorro',
      veterinarianId: 5,
    };


    appointmentService.save
      .mockRejectedValue(
        new Error('Veterinarian not found'),
      );


    await expect(
      controller.create(user, dto),
    )
      .rejects
      .toThrow('Veterinarian not found');


    expect(appointmentService.save)
      .toHaveBeenCalledWith(
        user.id,
        dto,
      );
  });

});
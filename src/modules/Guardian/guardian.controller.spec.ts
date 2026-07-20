import { Test } from '@nestjs/testing';
import { AppointmentService } from '../Appointment/appointment.service';
import { GuardianController } from './guardian.controller';
import { GuardianService } from './guardian.service';
import { UserService } from '../User/user.service';
import { UserType } from '../User/enums/user.enum';

describe('GuardianController', () => {
  let controller: GuardianController;

  let guardianService: {
    findAll: jest.Mock;
    save: jest.Mock;
    update: jest.Mock;
    delete: jest.Mock;
  };

  let userService: {
    changePassword: jest.Mock;
    deleteMyAccount: jest.Mock;
  };

  let appointmentService: {
    cancelMyAppointment: jest.Mock;
  };


  beforeEach(async () => {
    guardianService = {
      findAll: jest.fn(),
      save: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    userService = {
      changePassword: jest.fn(),
      deleteMyAccount: jest.fn(),
    };

    appointmentService = {
      cancelMyAppointment: jest.fn(),
    };


    const moduleRef = await Test.createTestingModule({
      controllers: [
        GuardianController,
      ],
      providers: [
        {
          provide: GuardianService,
          useValue: guardianService,
        },
        {
          provide: UserService,
          useValue: userService,
        },
        {
          provide: AppointmentService,
          useValue: appointmentService,
        },
      ],
    }).compile();


    controller = moduleRef.get<GuardianController>(
      GuardianController,
    );
  });


  afterEach(() => {
    jest.clearAllMocks();
  });


  it('should be defined', () => {
    expect(controller).toBeDefined();
  });


  it('should return all guardians', async () => {
    const guardians = [
      {
        id: 1,
        name: 'Maria Silva',
      },
    ];


    guardianService.findAll.mockResolvedValue(guardians);


    const result = await controller.findAll();


    expect(guardianService.findAll)
      .toHaveBeenCalled();


    expect(result)
      .toEqual(guardians);
  });


  it('should create a guardian', async () => {
    const dto = {
      name: 'Maria Silva',
      email: 'maria@email.com',
      password: '123456',
      cpf: '12345678900',
      phone: '85988332356',
    };


    const guardian = {
      id: 1,
      ...dto,
    };


    guardianService.save.mockResolvedValue(guardian);


    const result = await controller.save(dto);


    expect(guardianService.save)
      .toHaveBeenCalledWith(dto);


    expect(result)
      .toEqual(guardian);
  });


  it('should update logged guardian', async () => {
    const user = {
      id: 1,
      name: 'Maria Silva',
      email: 'maria@email.com',
      type: UserType.GUARDIAN,
    };


    const dto = {
      name: 'Maria Souza',
    };


    const updatedGuardian = {
      id: 1,
      name: 'Maria Souza',
    };


    guardianService.update.mockResolvedValue(updatedGuardian);


    const result = await controller.update(
      user,
      dto,
    );


    expect(guardianService.update)
      .toHaveBeenCalledWith(
        user.id,
        dto,
      );


    expect(result)
      .toEqual(updatedGuardian);
  });


  it('should change guardian password', async () => {
    const user = {
      id: 1,
      name: 'Maria Silva',
      email: 'maria@email.com',
      type: UserType.GUARDIAN,
    };


    const dto = {
    password: '123456',
      newPassword: '654321',
    };


    const response = {
      message: 'Password changed',
    };


  

    expect(userService.changePassword)
      .toHaveBeenCalledWith(
        user.id,
        dto,
      );


    
  });


  it('should delete logged guardian account', async () => {
    const user = {
      id: 1,
      name: 'Maria Silva',
      email: 'maria@email.com',
      type: UserType.GUARDIAN,
    };


    const response = {
      message: 'Account deleted',
    };


    userService.deleteMyAccount.mockResolvedValue(response);




  });


  it('should delete guardian by id', async () => {
    guardianService.delete.mockResolvedValue(undefined);


     controller.delete(1);


    expect(guardianService.delete)
      .toHaveBeenCalledWith(1);
  });


  it('should cancel logged guardian appointment', async () => {
    const user = {
      id: 1,
      name: 'Maria Silva',
      email: 'maria@email.com',
      type: UserType.GUARDIAN,
    };


    const response = {
      message: 'Appointment cancelled',
    };


    


   
  });

});
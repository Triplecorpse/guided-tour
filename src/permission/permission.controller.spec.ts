import { Test, TestingModule } from '@nestjs/testing';
import { PermissionController } from './permission.controller';
import { PermissionService } from './permission.service';
import { CreatePermissionDto } from './interface/createPermissionDto';
import { UpdatePermissionDto } from './interface/updatePermissionDto';
import { Permission } from './interface/Permission';

describe('PermissionController', () => {
  let controller: PermissionController;
  let service: PermissionService;

  const mockPermissionService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PermissionController],
      providers: [
        {
          provide: PermissionService,
          useValue: mockPermissionService,
        },
      ],
    }).compile();

    controller = module.get<PermissionController>(PermissionController);
    service = module.get<PermissionService>(PermissionService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a new permission', async () => {
      const createPermissionDto: CreatePermissionDto = {
        name: 'test-permission',
        createUser: true,
        readUser: false,
        updateUser: false,
        deleteUser: false,
        createPoi: true,
        readPoi: true,
        updatePoi: false,
        deletePoi: false,
        createLocation: false,
        readLocation: true,
        updateLocation: false,
        deleteLocation: false,
      };
      const createdPermission: Permission = {
        id: 1,
        ...createPermissionDto,
      };

      mockPermissionService.create.mockResolvedValue(createdPermission);

      const result = await controller.create(createPermissionDto);

      expect(service.create).toHaveBeenCalledWith(createPermissionDto);
      expect(result).toEqual(createdPermission);
    });

    it('should handle service errors during creation', async () => {
      const createPermissionDto: CreatePermissionDto = {
        name: 'test-permission',
        createUser: true,
        readUser: false,
        updateUser: false,
        deleteUser: false,
        createPoi: true,
        readPoi: true,
        updatePoi: false,
        deletePoi: false,
        createLocation: false,
        readLocation: true,
        updateLocation: false,
        deleteLocation: false,
      };
      const error = new Error('Service error');

      mockPermissionService.create.mockRejectedValue(error);

      await expect(controller.create(createPermissionDto)).rejects.toThrow(error);
    });
  });

  describe('findAll', () => {
    it('should return all permissions', async () => {
      const permissions: Permission[] = [
        {
          id: 1,
          name: 'permission1',
          createUser: true,
          readUser: false,
          updateUser: false,
          deleteUser: false,
          createPoi: true,
          readPoi: true,
          updatePoi: false,
          deletePoi: false,
          createLocation: false,
          readLocation: true,
          updateLocation: false,
          deleteLocation: false,
        },
        {
          id: 2,
          name: 'permission2',
          createUser: false,
          readUser: true,
          updateUser: false,
          deleteUser: false,
          createPoi: false,
          readPoi: true,
          updatePoi: false,
          deletePoi: false,
          createLocation: false,
          readLocation: true,
          updateLocation: false,
          deleteLocation: false,
        },
      ];

      mockPermissionService.findAll.mockResolvedValue(permissions);

      const result = await controller.findAll();

      expect(service.findAll).toHaveBeenCalled();
      expect(result).toEqual(permissions);
    });

    it('should return empty array when no permissions exist', async () => {
      mockPermissionService.findAll.mockResolvedValue([]);

      const result = await controller.findAll();

      expect(result).toEqual([]);
    });
  });

  describe('findOne', () => {
    it('should return a permission by id', async () => {
      const permission: Permission = {
        id: 1,
        name: 'test-permission',
        createUser: true,
        readUser: false,
        updateUser: false,
        deleteUser: false,
        createPoi: true,
        readPoi: true,
        updatePoi: false,
        deletePoi: false,
        createLocation: false,
        readLocation: true,
        updateLocation: false,
        deleteLocation: false,
      };

      mockPermissionService.findOne.mockResolvedValue(permission);

      const result = await controller.findOne(1);

      expect(service.findOne).toHaveBeenCalledWith(1);
      expect(result).toEqual(permission);
    });

    it('should return null when permission not found', async () => {
      mockPermissionService.findOne.mockResolvedValue(null);

      const result = await controller.findOne(999);

      expect(result).toBeNull();
    });
  });

  describe('update', () => {
    it('should update a permission and return the updated permission', async () => {
      const updatePermissionDto: UpdatePermissionDto = {
        name: 'updated-permission',
        createUser: false,
        readUser: true,
      };
      const updatedPermission: Permission = {
        id: 1,
        name: 'updated-permission',
        createUser: false,
        readUser: true,
        updateUser: false,
        deleteUser: false,
        createPoi: true,
        readPoi: true,
        updatePoi: false,
        deletePoi: false,
        createLocation: false,
        readLocation: true,
        updateLocation: false,
        deleteLocation: false,
      };

      mockPermissionService.update.mockResolvedValue(updatedPermission);

      const result = await controller.update(1, updatePermissionDto);

      expect(service.update).toHaveBeenCalledWith(1, updatePermissionDto);
      expect(result).toEqual(updatedPermission);
    });

    it('should return null when permission to update not found', async () => {
      const updatePermissionDto: UpdatePermissionDto = {
        name: 'updated-permission',
      };

      mockPermissionService.update.mockResolvedValue(null);

      const result = await controller.update(999, updatePermissionDto);

      expect(result).toBeNull();
    });
  });

  describe('remove', () => {
    it('should delete a permission', async () => {
      mockPermissionService.remove.mockResolvedValue(undefined);

      await controller.remove(1);

      expect(service.remove).toHaveBeenCalledWith(1);
    });

    it('should handle service errors during deletion', async () => {
      const error = new Error('Service error');

      mockPermissionService.remove.mockRejectedValue(error);

      await expect(controller.remove(1)).rejects.toThrow(error);
    });
  });
}); 
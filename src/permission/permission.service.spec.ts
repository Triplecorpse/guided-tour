import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PermissionService } from './permission.service';
import { Permission } from './interface/Permission';
import { UpdatePermissionDto } from './interface/updatePermissionDto';

describe('PermissionService', () => {
  let service: PermissionService;
  let repository: Repository<Permission>;

  const mockRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PermissionService,
        {
          provide: getRepositoryToken(Permission),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<PermissionService>(PermissionService);
    repository = module.get<Repository<Permission>>(getRepositoryToken(Permission));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new permission', async () => {
      const permissionData = {
        name: 'test-permission',
        description: 'Test permission',
      };
      const createdPermission = { id: 1, ...permissionData };
      
      mockRepository.create.mockReturnValue(createdPermission);
      mockRepository.save.mockResolvedValue(createdPermission);

      const result = await service.create(permissionData);

      expect(mockRepository.create).toHaveBeenCalledWith(permissionData);
      expect(mockRepository.save).toHaveBeenCalledWith(createdPermission);
      expect(result).toEqual(createdPermission);
    });

    it('should handle repository errors during creation', async () => {
      const permissionData = { name: 'test-permission' };
      const error = new Error('Database error');
      
      mockRepository.create.mockReturnValue({});
      mockRepository.save.mockRejectedValue(error);

      await expect(service.create(permissionData)).rejects.toThrow(error);
    });
  });

  describe('findAll', () => {
    it('should return all permissions', async () => {
      const permissions = [
        { id: 1, name: 'permission1', description: 'First permission' },
        { id: 2, name: 'permission2', description: 'Second permission' },
      ];
      
      mockRepository.find.mockResolvedValue(permissions);

      const result = await service.findAll();

      expect(mockRepository.find).toHaveBeenCalled();
      expect(result).toEqual(permissions);
    });

    it('should return empty array when no permissions exist', async () => {
      mockRepository.find.mockResolvedValue([]);

      const result = await service.findAll();

      expect(result).toEqual([]);
    });
  });

  describe('findOne', () => {
    it('should return a permission by id', async () => {
      const permission = { id: 1, name: 'test-permission', description: 'Test' };
      
      mockRepository.findOne.mockResolvedValue(permission);

      const result = await service.findOne(1);

      expect(mockRepository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(result).toEqual(permission);
    });

    it('should return null when permission not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      const result = await service.findOne(999);

      expect(result).toBeNull();
    });
  });

  describe('update', () => {
    it('should update a permission and return the updated permission', async () => {
      const updateData: Partial<UpdatePermissionDto> = {
        name: 'updated-permission',
        createUser: true,
        readUser: false,
      };
      const updatedPermission = { id: 1, ...updateData };
      
      mockRepository.update.mockResolvedValue({ affected: 1 });
      mockRepository.findOne.mockResolvedValue(updatedPermission);

      const result = await service.update(1, updateData);

      expect(mockRepository.update).toHaveBeenCalledWith(1, updateData);
      expect(mockRepository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(result).toEqual(updatedPermission);
    });

    it('should return null when permission to update not found', async () => {
      const updateData = { name: 'updated-permission' };
      
      mockRepository.update.mockResolvedValue({ affected: 0 });
      mockRepository.findOne.mockResolvedValue(null);

      const result = await service.update(999, updateData);

      expect(result).toBeNull();
    });
  });

  describe('remove', () => {
    it('should delete a permission', async () => {
      mockRepository.delete.mockResolvedValue({ affected: 1 });

      await service.remove(1);

      expect(mockRepository.delete).toHaveBeenCalledWith(1);
    });

    it('should handle deletion of non-existent permission', async () => {
      mockRepository.delete.mockResolvedValue({ affected: 0 });

      await service.remove(999);

      expect(mockRepository.delete).toHaveBeenCalledWith(999);
    });
  });
}); 
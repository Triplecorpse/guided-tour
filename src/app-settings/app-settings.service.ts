import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AppSettings } from './interface/AppSettings';
import { CreateAppSettingDto } from './dto/create-app-setting.dto';
import { UpdateAppSettingDto } from './dto/update-app-setting.dto';

@Injectable()
export class AppSettingsService {
  constructor(
    @InjectRepository(AppSettings)
    private appSettingsRepository: Repository<AppSettings>,
  ) {}

  async create(createAppSettingDto: CreateAppSettingDto): Promise<AppSettings> {
    const existingSetting = await this.appSettingsRepository.findOne({
      where: { key: createAppSettingDto.key },
    });

    if (existingSetting) {
      throw new BadRequestException(`Setting with key '${createAppSettingDto.key}' already exists`);
    }

    const appSetting = this.appSettingsRepository.create(createAppSettingDto);
    return this.appSettingsRepository.save(appSetting);
  }

  async findAll(): Promise<AppSettings[]> {
    return this.appSettingsRepository.find();
  }

  async findOne(id: number): Promise<AppSettings> {
    const appSetting = await this.appSettingsRepository.findOne({
      where: { id },
    });

    if (!appSetting) {
      throw new NotFoundException(`App setting with ID ${id} not found`);
    }

    return appSetting;
  }

  async findByKey(key: string): Promise<AppSettings> {
    const appSetting = await this.appSettingsRepository.findOne({
      where: { key },
    });

    if (!appSetting) {
      throw new NotFoundException(`App setting with key '${key}' not found`);
    }

    return appSetting;
  }

  async update(id: number, updateAppSettingDto: UpdateAppSettingDto): Promise<AppSettings> {
    const appSetting = await this.findOne(id);

    // If key is being changed, check if the new key already exists
    if (updateAppSettingDto.key && updateAppSettingDto.key !== appSetting.key) {
      const existingSetting = await this.appSettingsRepository.findOne({
        where: { key: updateAppSettingDto.key },
      });

      if (existingSetting) {
        throw new BadRequestException(`Setting with key '${updateAppSettingDto.key}' already exists`);
      }
    }

    const updatedSetting = Object.assign(appSetting, updateAppSettingDto);
    return this.appSettingsRepository.save(updatedSetting);
  }

  async remove(id: number): Promise<void> {
    const appSetting = await this.findOne(id);
    await this.appSettingsRepository.remove(appSetting);
  }

  async upsertByKey(key: string, value: string): Promise<AppSettings> {
    try {
      const existingSetting = await this.findByKey(key);
      existingSetting.value = value;
      return this.appSettingsRepository.save(existingSetting);
    } catch (error) {
      if (error instanceof NotFoundException) {
        return this.create({ key, value });
      }
      throw error;
    }
  }
}

import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { AppSettingsService } from './app-settings.service';
import { CreateAppSettingDto } from './dto/create-app-setting.dto';
import { UpdateAppSettingDto } from './dto/update-app-setting.dto';
import { AppSettings } from './interface/AppSettings';

@ApiTags('app-settings')
@Controller('app-settings')
export class AppSettingsController {
  constructor(private readonly appSettingsService: AppSettingsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new app setting' })
  @ApiResponse({ status: 201, description: 'Setting successfully created', type: AppSettings })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async create(@Body() createAppSettingDto: CreateAppSettingDto): Promise<AppSettings> {
    return this.appSettingsService.create(createAppSettingDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all app settings' })
  @ApiResponse({ status: 200, description: 'Return all app settings', type: [AppSettings] })
  async findAll(): Promise<AppSettings[]> {
    return this.appSettingsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get an app setting by ID' })
  @ApiParam({ name: 'id', type: 'number' })
  @ApiResponse({ status: 200, description: 'Return the app setting', type: AppSettings })
  @ApiResponse({ status: 404, description: 'App setting not found' })
  async findOne(@Param('id') id: string): Promise<AppSettings> {
    return this.appSettingsService.findOne(+id);
  }

  @Get('key/:key')
  @ApiOperation({ summary: 'Get an app setting by key' })
  @ApiParam({ name: 'key', type: 'string' })
  @ApiResponse({ status: 200, description: 'Return the app setting', type: AppSettings })
  @ApiResponse({ status: 404, description: 'App setting not found' })
  async findByKey(@Param('key') key: string): Promise<AppSettings> {
    return this.appSettingsService.findByKey(key);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update an app setting' })
  @ApiParam({ name: 'id', type: 'number' })
  @ApiResponse({ status: 200, description: 'Setting successfully updated', type: AppSettings })
  @ApiResponse({ status: 404, description: 'App setting not found' })
  async update(
    @Param('id') id: string,
    @Body() updateAppSettingDto: UpdateAppSettingDto,
  ): Promise<AppSettings> {
    return this.appSettingsService.update(+id, updateAppSettingDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete an app setting' })
  @ApiParam({ name: 'id', type: 'number' })
  @ApiResponse({ status: 200, description: 'Setting successfully deleted' })
  @ApiResponse({ status: 404, description: 'App setting not found' })
  async remove(@Param('id') id: string): Promise<void> {
    return this.appSettingsService.remove(+id);
  }

  @Post('upsert')
  @ApiOperation({ summary: 'Create or update an app setting by key' })
  @ApiResponse({ status: 200, description: 'Setting successfully upserted', type: AppSettings })
  async upsert(@Body() createAppSettingDto: CreateAppSettingDto): Promise<AppSettings> {
    return this.appSettingsService.upsertByKey(
      createAppSettingDto.key,
      createAppSettingDto.value,
    );
  }
}

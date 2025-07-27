import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppSettingsController } from './app-settings.controller';
import { AppSettingsService } from './app-settings.service';
import { AppSettings } from './interface/AppSettings';

@Module({
  imports: [TypeOrmModule.forFeature([AppSettings])],
  controllers: [AppSettingsController],
  providers: [AppSettingsService],
  exports: [AppSettingsService]
})
export class AppSettingsModule {}

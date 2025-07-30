import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { DataSource } from 'typeorm';
import { Permission } from '../permission/interface/Permission';
import { User } from '../iam/User';
import { HashingService } from '../iam/hashing.service';
import { AppSettings } from '../app-settings/interface/AppSettings';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const dataSource = app.get(DataSource);
  const hashingService = app.get(HashingService);

  // Create or find superadmin permission
  let superadminPermission = await dataSource.getRepository(Permission).findOneBy({ name: 'superadmin' });
  if (!superadminPermission) {
    superadminPermission = dataSource.getRepository(Permission).create({
      name: 'superadmin',
      createUser: true,
      readUser: true,
      updateUser: true,
      deleteUser: true,
      createPoi: true,
      readPoi: true,
      updatePoi: true,
      deletePoi: true,
      createLocation: true,
      readLocation: true,
      updateLocation: true,
      deleteLocation: true,
    });
    await dataSource.getRepository(Permission).save(superadminPermission);
    console.log('Created superadmin permission');
  } else {
    console.log('Superadmin permission already exists');
  }

  // Create or find regular user permission
  let regularUserPermission = await dataSource.getRepository(Permission).findOneBy({ name: 'regular_user' });
  if (!regularUserPermission) {
    regularUserPermission = dataSource.getRepository(Permission).create({
      name: 'regular_user',
      createUser: false,
      readUser: false,
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
    });
    await dataSource.getRepository(Permission).save(regularUserPermission);
    console.log('Created regular user permission');
  } else {
    console.log('Regular user permission already exists');
  }

  // Create or find superadmin user
  let superadminUser = await dataSource.getRepository(User).findOneBy({ email: 'superadmin@example.com' });
  if (!superadminUser) {
    const password = await hashingService.hash('superadmin123');
    superadminUser = dataSource.getRepository(User).create({
      email: 'superadmin@example.com',
      password,
      full_name: 'Super Admin',
      role: superadminPermission,
    });
    await dataSource.getRepository(User).save(superadminUser);
    console.log('Created superadmin user');
  } else {
    console.log('Superadmin user already exists');
  }

  // Create or update app settings with default role
  let defaultRoleSetting = await dataSource.getRepository(AppSettings).findOneBy({ key: 'default_role' });
  if (!defaultRoleSetting) {
    defaultRoleSetting = dataSource.getRepository(AppSettings).create({
      key: 'default_role',
      value: regularUserPermission.id.toString(),
    });
    await dataSource.getRepository(AppSettings).save(defaultRoleSetting);
    console.log('Created default role setting');
  } else {
    // Update the value to point to regular user permission
    defaultRoleSetting.value = regularUserPermission.id.toString();
    await dataSource.getRepository(AppSettings).save(defaultRoleSetting);
    console.log('Updated default role setting');
  }

  await app.close();
}

bootstrap().catch((err) => {
  console.error(err);
  process.exit(1);
}); 
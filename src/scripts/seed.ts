import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { DataSource } from 'typeorm';
import { Permission } from '../permission/interface/Permission';
import { User } from '../iam/User';
import { HashingService } from '../iam/hashing.service';

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

  await app.close();
}

bootstrap().catch((err) => {
  console.error(err);
  process.exit(1);
}); 
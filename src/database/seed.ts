import { UserEntity } from './entity/user.entity';
import { LoginEntity } from './entity/login.entity';
import * as bcrypt from 'bcrypt';
import dataSource from './data-source';

export async function seed() {
  try {
    await (await dataSource).initialize();

    const loginRepository = (await dataSource).getRepository(LoginEntity);
    const userRepository = (await dataSource).getRepository(UserEntity);

    const existingAdmin = await loginRepository.findOne({
      where: { passid: 'admin' },
    });

    if (existingAdmin) {
      console.log('Admin user already exists. Skipping seed.');
      return;
    }

    const hashedPassword = await bcrypt.hash('recipot1!11', 10);

    const login = loginRepository.create({
      passid: 'admin',
      password: hashedPassword,
    });
    await loginRepository.save(login);

    const adminUser = userRepository.create({
      // name: 'admin', // 엔터티 구조 변경에 따른 수정
      login: login,
    });
    await userRepository.save(adminUser);

    console.log('Admin user created successfully.');
  } catch (error) {
    console.error('Failed to seed admin user:', error);
  } finally {
    await (await dataSource).destroy();
  }
}

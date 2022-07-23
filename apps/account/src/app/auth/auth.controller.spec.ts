import { AccountRegister, AccountLogin } from '@test-monorepo/contracts';
import { UserRepository } from './../user/repositories/user.repository';
import { AuthModule } from './auth.module';
import { getMongoConfig } from './../configs/mongo.config';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './../user/user.module';
import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing'
import { RMQModule, RMQService, RMQTestService } from 'nestjs-rmq';
import { INestApplication } from '@nestjs/common';

const authLogin: AccountLogin.Request = {
  email: 'a@a.ru',
  password: '1'
}

const authRegister: AccountRegister.Request = {
  ...authLogin,
  displayName: 'John'
}

describe('AuthController', () => {
  let app: INestApplication;
  let userRepository: UserRepository;
  let rmqService: RMQTestService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({ isGlobal: true, envFilePath: 'envs/.account.env' }),
        RMQModule.forTest({}),
        UserModule,
        AuthModule,
        MongooseModule.forRootAsync(getMongoConfig())
      ]
    }).compile();
    app = module.createNestApplication();
    userRepository = app.get<UserRepository>(UserRepository);
    rmqService = app.get(RMQService);
    await app.init();
  })

  it('Register', async () => {
    const res = await rmqService.triggerRoute<AccountRegister.Request, AccountRegister.Response>(AccountRegister.topic, authRegister);
    expect(res.email).toEqual(authRegister.email);
  });

  it('Login', async () => {
    const res = await rmqService.triggerRoute<AccountLogin.Request, AccountLogin.Response>(AccountLogin.topic, authLogin);
    expect(res.access_token).toBeDefined();
  });

  afterAll(async () => {
    await userRepository.deleteUser(authRegister.email);
    app.close();
  })
})

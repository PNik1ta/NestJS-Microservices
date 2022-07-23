import { UserController } from './controllers/user.controller';
import { JwtModule } from '@nestjs/jwt';
import { RMQModule } from 'nestjs-rmq';
import { ConfigModule } from '@nestjs/config';
import { Module } from '@nestjs/common';
import { AuthController } from './controllers/auth.controller';
import { getRMQConfig } from './configs/rmq.config';
import { PassportModule } from '@nestjs/passport';
import { getJwtConfig } from './configs/jwt.config';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
	imports: [
		ConfigModule.forRoot({ envFilePath: 'envs/.api.env', isGlobal: true }),
		RMQModule.forRootAsync(getRMQConfig()),
		JwtModule.registerAsync(getJwtConfig()),
		PassportModule,
    ScheduleModule.forRoot()
	],
	controllers: [AuthController, UserController]
})
export class AppModule { }

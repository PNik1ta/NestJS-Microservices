import { UserService } from './user.service';
import { UserEventEmitter } from './user.event-emitter';
import { UserQueries } from './user.queries';
import { UserCommands } from './user.commands';
import { UserRepository } from './repositories/user.repository';
import { User, UserSchema } from './models/user.model';
import { MongooseModule } from '@nestjs/mongoose';
import { Module } from '@nestjs/common';

@Module({
	imports: [MongooseModule.forFeature([
		{ name: User.name, schema: UserSchema }
	])],
	providers: [UserRepository, UserEventEmitter, UserService],
	exports: [UserRepository],
	controllers: [UserCommands, UserQueries]
})
export class UserModule { }

import { UserEntity } from './entites/user.entity';
import { UserRepository } from './repositories/user.repository';
import { Body, Controller, Get } from "@nestjs/common";
import { AccountUserCourses, AccountUserInfo } from "@test-monorepo/contracts";
import { RMQRoute, RMQService, RMQValidate } from "nestjs-rmq";

@Controller()
export class UserQueries {
	constructor(private userRepository: UserRepository, private readonly rmqService: RMQService) { }

	@RMQValidate()
	@RMQRoute(AccountUserInfo.topic)
	async userInfo(@Body() { id }: AccountUserInfo.Request): Promise<AccountUserInfo.Response> {
		const user = await this.userRepository.findUserById(id);
		const profile = new UserEntity(user).getPublicProfile();
		return {
			profile
		};
	}

	@RMQValidate()
	@RMQRoute(AccountUserCourses.topic)
	async userCourses(@Body() { id }: AccountUserCourses.Request): Promise<AccountUserCourses.Response> {
		const user = await this.userRepository.findUserById(id);
		return {
			courses: user.courses
		};
	}

  @Get('healthcheck')
  async healthCheck() {
    const isRMQ = await this.rmqService.healthCheck();
    const user = await this.userRepository.healthCheck();
  }
}

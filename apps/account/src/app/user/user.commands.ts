import { UserService } from './user.service';
import { Body, Controller } from "@nestjs/common";
import { AcccountBuyCourse, AcccountChangeProfile, AcccountCheckPayment } from "@test-monorepo/contracts";
import { RMQRoute, RMQValidate } from "nestjs-rmq";

@Controller()
export class UserCommands {
  constructor(private readonly userService: UserService) { }

  @RMQValidate()
  @RMQRoute(AcccountChangeProfile.topic)
  async changeProfile(@Body() { id, user }: AcccountChangeProfile.Request): Promise<AcccountChangeProfile.Response> {
    return this.userService.changeProfile(user, id);
  }

  @RMQValidate()
  @RMQRoute(AcccountBuyCourse.topic)
  async buyCourse(@Body() { userId, courseId }: AcccountBuyCourse.Request): Promise<AcccountBuyCourse.Response> {
    return this.userService.buyCourse(userId, courseId);
  }

  @RMQValidate()
  @RMQRoute(AcccountCheckPayment.topic)
  async checkPayment(@Body() { userId, courseId }: AcccountCheckPayment.Request): Promise<AcccountCheckPayment.Response> {
    return this.userService.checkPayment(userId, courseId);
  }
}

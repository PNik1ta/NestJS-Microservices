import { UserEventEmitter } from './user.event-emitter';
import { Injectable } from "@nestjs/common";
import { IUser } from "@test-monorepo/interfaces";
import { RMQService } from "nestjs-rmq";
import { UserEntity } from "./entites/user.entity";
import { UserRepository } from "./repositories/user.repository";
import { BuyCourseSaga } from "./sagas/buy-course.saga";

@Injectable()
export class UserService {
  constructor(
    private userRepository: UserRepository,
    private readonly rmqService: RMQService,
    private readonly userEventEmitter: UserEventEmitter) { }

  public async changeProfile(user: Pick<IUser, 'displayName'>, id: string) {
    const existedUser = await this.userRepository.findUserById(id);
    if (!existedUser) {
      throw new Error("This user doesn't exist");
    }
    const userEntity = new UserEntity(existedUser).updateProfile(user.displayName);
    await this.updateUser(userEntity);
    return {
      message: 'User updated successfully'
    };
  }

  public async buyCourse(userId: string, courseId: string) {
    const existedUser = await this.userRepository.findUserById(userId);

    if (!existedUser) {
      throw new Error("This user doesn't exist");
    }

    const userEntity = new UserEntity(existedUser);
    const saga = new BuyCourseSaga(userEntity, courseId, this.rmqService);
    const { user, paymentLink } = await saga.getState().pay();
    await this.updateUser(user);
    return { paymentLink }
  }

  public async checkPayment(userId: string, courseId: string) {
    const existedUser = await this.userRepository.findUserById(userId);

    if (!existedUser) {
      throw new Error("This user doesn't exist");
    }

    const userEntity = new UserEntity(existedUser);
    const saga = new BuyCourseSaga(userEntity, courseId, this.rmqService);
    const { user, status } = await saga.getState().checkPayment();
    await this.updateUser(user);
    return { status };
  }

  private updateUser(user: UserEntity) {
    return Promise.all([
      this.userEventEmitter.handle(user),
      this.userRepository.updateUser(user)
    ])
  }

}

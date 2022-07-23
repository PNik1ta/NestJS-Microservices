import { UserEntity } from './entites/user.entity';
import { RMQService } from 'nestjs-rmq';
import { Injectable } from "@nestjs/common";

@Injectable()
export class UserEventEmitter {
  constructor(private readonly rmqService: RMQService) {}

  async handle(user: UserEntity) {
    for(const event of user.events) {
      await this.rmqService.notify(event.topic, event.data);
    }
  }
}

import { JwtAuthGuard } from './../guards/jwt.guard';
import { Controller, Post, UseGuards, Logger } from '@nestjs/common';
import { UserId } from '../decorators/user.decorator';
import { Cron } from '@nestjs/schedule';


@Controller('user')
export class UserController {

  @UseGuards(JwtAuthGuard)
  @Post('info')
  async info(@UserId() userId: string): Promise<void> {
    
  }

  @Cron('*/5 * * * *')
  async cron() {
    Logger.log('Done');
  }
}

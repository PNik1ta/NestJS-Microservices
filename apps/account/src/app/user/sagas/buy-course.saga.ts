import { BuyCourseSagaStateCanceled } from './buy-course.state.canceled';
import { BuyCourseSagaStateFinished as BuyCourseSagaStatePurchased } from './buy-course.state.purchased';
import { BuyCourseSagaStateProcess } from './buy-course.state.process';
import { BuyCourseSagaStateStarted } from './buy-course.state.started';
import { PurchaseState } from '@test-monorepo/interfaces';
import { RMQService } from 'nestjs-rmq';
import { UserEntity } from './../entites/user.entity';
import { BuyCourseSagaState } from './buy-course.state';
export class BuyCourseSaga {
	private state: BuyCourseSagaState;

	constructor(public user: UserEntity, public courseId: string, public rmqService: RMQService) {
    this.setState(user.getCourseState(courseId), courseId);
  }

	setState(state: PurchaseState, courseId: string) {
		switch (state) {
			case PurchaseState.Started:
				this.state = new BuyCourseSagaStateStarted();
				break;
			case PurchaseState.WaitingForPayment:
				this.state = new BuyCourseSagaStateProcess();
				break;
			case PurchaseState.Purchased:
				this.state = new BuyCourseSagaStatePurchased();
				break;
			case PurchaseState.Canceled:
				this.state = new BuyCourseSagaStateCanceled();
				break;
		}
		this.state.setContext(this);
		this.user.setCourseStatus(courseId, state);
	}

	getState() {
		return this.state;
	}
}

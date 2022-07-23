import { PaymentStatus } from './../../../../../../libs/contracts/src/lib/payment/payment.check';
import { PaymentCheck } from "@test-monorepo/contracts";
import { PurchaseState } from "@test-monorepo/interfaces";
import { UserEntity } from "../entites/user.entity";
import { BuyCourseSagaState } from "./buy-course.state";

export class BuyCourseSagaStateProcess extends BuyCourseSagaState {

	public pay(): Promise<{ paymentLink: string; user: UserEntity; }> {
		throw new Error("Can't generate link in process");
	}

	public async checkPayment(): Promise<{ user: UserEntity, status: PaymentStatus }> {
		const { status } = await this.saga.rmqService.send<PaymentCheck.Request, PaymentCheck.Response>(PaymentCheck.topic, {
			userId: this.saga.user._id,
			courseId: this.saga.courseId
		});
		if (status === 'canceled') {
			this.saga.setState(PurchaseState.Canceled, this.saga.courseId);
			return { user: this.saga.user, status: 'canceled' };
		}
		if (status === 'successed') {
			return { user: this.saga.user, status: 'successed'};
		}
		this.saga.setState(PurchaseState.Purchased, this.saga.courseId);
		return { user: this.saga.user, status: 'progress' };
	}

	public cancel(): Promise<{ user: UserEntity; }> {
		throw new Error("Can't cancel purchase in process");
	}

}

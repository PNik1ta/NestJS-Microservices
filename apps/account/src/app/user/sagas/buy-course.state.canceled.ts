import { PaymentStatus } from './../../../../../../libs/contracts/src/lib/payment/payment.check';
import { PurchaseState } from "@test-monorepo/interfaces";
import { UserEntity } from "../entites/user.entity";
import { BuyCourseSagaState } from "./buy-course.state";

export class BuyCourseSagaStateCanceled extends BuyCourseSagaState {

	public pay(): Promise<{ paymentLink: string; user: UserEntity; }> {
		this.saga.setState(PurchaseState.Started, this.saga.courseId);
		return this.saga.getState().pay();
	}

	public checkPayment(): Promise<{ user: UserEntity, status: PaymentStatus }> {
		throw new Error("Can't check canceled course");
	}

	public cancel(): Promise<{ user: UserEntity; }> {
		throw new Error("Can't cancel canceled course");
	}



}
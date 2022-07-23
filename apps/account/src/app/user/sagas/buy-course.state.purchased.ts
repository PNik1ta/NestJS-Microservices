import { PaymentStatus } from './../../../../../../libs/contracts/src/lib/payment/payment.check';
import { UserEntity } from "../entites/user.entity";
import { BuyCourseSagaState } from "./buy-course.state";

export class BuyCourseSagaStateFinished extends BuyCourseSagaState {

	public pay(): Promise<{ paymentLink: string; user: UserEntity; }> {
		throw new Error("Can't pay purchased course");
	}

	public checkPayment(): Promise<{ user: UserEntity, status: PaymentStatus}> {
		throw new Error("Can't check purchased course");
	}

	public cancel(): Promise<{ user: UserEntity; }> {
		throw new Error("Can't cancel purchased course");
	} 

}
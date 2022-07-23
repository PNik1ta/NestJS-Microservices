import { PaymentStatus } from './../../../../../../libs/contracts/src/lib/payment/payment.check';
import { CourseGetCourse, PaymentGenerateLink } from "@test-monorepo/contracts";
import { PurchaseState } from "@test-monorepo/interfaces";
import { UserEntity } from "../entites/user.entity";
import { BuyCourseSagaState } from "./buy-course.state";

export class BuyCourseSagaStateStarted extends BuyCourseSagaState {
	public async pay(): Promise<{ paymentLink: string; user: UserEntity; }> {
		const { course } = await this.saga.rmqService.send<CourseGetCourse.Request, CourseGetCourse.Response>(CourseGetCourse.topic, {
			id: this.saga.courseId
		});

		if (!course) {
			throw new Error("This course doesn't exist");
		}

		if (course.price == 0) {
			this.saga.setState(PurchaseState.Purchased, course._id);
			return { paymentLink: null, user: this.saga.user }
		}

		const { paymentLink } = await this.saga.rmqService.send<PaymentGenerateLink.Request, PaymentGenerateLink.Response>(PaymentGenerateLink.topic, {
			courseId: course._id,
			userId: this.saga.user._id,
			sum: course.price
		});

		this.saga.setState(PurchaseState.WaitingForPayment, course._id);
		return { paymentLink: paymentLink, user: this.saga.user }
	}

	public checkPayment(): Promise<{ user: UserEntity, status: PaymentStatus }> {
		throw new Error("Can't check payment, which not started");
	}

	public async cancel(): Promise<{ user: UserEntity; }> {
		this.saga.setState(PurchaseState.Canceled, this.saga.courseId);
		return { user: this.saga.user };
	}

}
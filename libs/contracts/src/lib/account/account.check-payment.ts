import { IsString } from 'class-validator';
import { PaymentStatus } from '../payment/payment.check';
export namespace AcccountCheckPayment {
	export const topic = 'account.check-payment.command';

	export class Request {
		@IsString()
		userId: string;

		@IsString()
		courseId: string;
	}

	export class Response {
		status: PaymentStatus;
	}
}
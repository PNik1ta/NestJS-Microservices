import { IUser } from '@test-monorepo/interfaces';
import { IsString } from 'class-validator';
export namespace AcccountChangeProfile {
	export const topic = 'account.change-profile.command';

	export class Request {
		@IsString()
		id: string;

		@IsString()
		user: Pick<IUser, 'displayName'>;
	}

	export class Response {
		message: string;
	}
}
import { authJWT, rateLimiter } from '../../../middleware';
import { EndpointFunction } from '../../../../typings';

export class FixedWeightFiveEndpoint extends EndpointFunction {
	constructor() {
		super([authJWT(), rateLimiter(5)]);
	}

	protected async executeImpl(): Promise<void | any> {
		try {
			return this.ok({ message: 'FixedWeightFiveEndpoint', status: 200 });
		} catch (error) {
			this.next(error);
		}
	}
}

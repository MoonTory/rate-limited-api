import { authJWT, rateLimiter } from '../../../middleware';
import { EndpointFunction } from '../../../../typings';

export class SlidingWeightFiveEndpoint extends EndpointFunction {
	constructor() {
		super([authJWT(), rateLimiter(5, 'slidingWindow')]);
	}

	protected async executeImpl(): Promise<void | any> {
		try {
			return this.ok({ message: 'SlidingWeightFiveEndpoint' });
		} catch (error) {
			this.next(error);
		}
	}
}

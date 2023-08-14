import { authJWT, rateLimiter } from '../../../middleware';
import { EndpointFunction } from '../../../../typings';

export class SlidingWeightTwoEndpoint extends EndpointFunction {
	constructor() {
		super([authJWT(), rateLimiter(2, 'slidingWindow')]);
	}

	protected async executeImpl(): Promise<void | any> {
		try {
			return this.ok({ message: 'SlidingWeightTwoEndpoint' });
		} catch (error) {
			this.next(error);
		}
	}
}

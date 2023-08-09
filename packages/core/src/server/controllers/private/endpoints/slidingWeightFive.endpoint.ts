import { authJWT, rateLimitSliding } from '../../../middleware';
import { EndpointFunction } from '../../../../typings';

export class SlidingWeightFiveEndpoint extends EndpointFunction {
	constructor() {
		super([authJWT(), rateLimitSliding(5)]);
	}

	protected async executeImpl(): Promise<void | any> {
		try {
			return this.ok({ message: 'SlidingWeightFiveEndpoint' });
		} catch (error) {
			this.next(error);
		}
	}
}

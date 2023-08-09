import { authJWT, rateLimitSliding } from '../../../middleware';
import { EndpointFunction } from '../../../../typings';

export class SlidingWeightTwoEndpoint extends EndpointFunction {
	constructor() {
		super([authJWT(), rateLimitSliding(2)]);
	}

	protected async executeImpl(): Promise<void | any> {
		try {
			return this.ok({ message: 'SlidingWeightTwoEndpoint' });
		} catch (error) {
			this.next(error);
		}
	}
}

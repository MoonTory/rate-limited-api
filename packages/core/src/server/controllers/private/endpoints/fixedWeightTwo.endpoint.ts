import { authJWT, rateLimiter } from '../../../middleware';
import { EndpointFunction } from '../../../../typings';

export class FixedWeightTwoEndpoint extends EndpointFunction {
	constructor() {
		super([authJWT(), rateLimiter(2)]);
	}

	protected async executeImpl(): Promise<void | any> {
		try {
			return this.ok({ message: 'FixedWeightTwoEndpoint', status: 200 });
		} catch (error) {
			this.next(error);
		}
	}
}

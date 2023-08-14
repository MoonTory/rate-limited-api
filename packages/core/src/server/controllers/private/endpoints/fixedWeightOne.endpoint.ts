import { authJWT, rateLimiter } from '../../../middleware';
import { EndpointFunction } from '../../../../typings';

export class FixedWeightOneEndpoint extends EndpointFunction {
	constructor() {
		super([authJWT(), rateLimiter()]);
	}

	protected async executeImpl(): Promise<void | any> {
		try {
			return this.ok({ message: 'FixedWeightOneEndpoint', status: 200 });
		} catch (error) {
			this.next(error);
		}
	}
}

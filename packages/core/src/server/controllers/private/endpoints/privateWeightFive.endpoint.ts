import { authJWT, rateLimit } from '../../../middleware';
import { EndpointFunction } from '../../../../typings';

export class PrivateWeightFiveEndpoint extends EndpointFunction {
	constructor() {
		super([authJWT(), rateLimit(5)]);
	}

	protected async executeImpl(): Promise<void | any> {
		try {
			return this.ok({ message: 'PrivateWeightFiveEndpoint' });
		} catch (error) {
			this.next(error);
		}
	}
}

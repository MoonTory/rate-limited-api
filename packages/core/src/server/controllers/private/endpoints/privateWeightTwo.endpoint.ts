import { authJWT, rateLimit } from '../../../middleware';
import { EndpointFunction } from '../../../../typings';

export class PrivateWeightTwoEndpoint extends EndpointFunction {
	constructor() {
		super([authJWT(), rateLimit(2)]);
	}

	protected async executeImpl(): Promise<void | any> {
		try {
			return this.ok({ message: 'PrivateWeightTwoEndpoint' });
		} catch (error) {
			this.next(error);
		}
	}
}

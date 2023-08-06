import { authJWT, rateLimit } from '../../../middleware';
import { EndpointFunction } from '../../../../typings';

export class PrivateWeightOneEndpoint extends EndpointFunction {
	constructor() {
		super([authJWT(), rateLimit()]);
	}

	protected async executeImpl(): Promise<void | any> {
		try {
			return this.ok({ message: 'PrivateWeightOneEndpoint', status: 200 });
		} catch (error) {
			this.next(error);
		}
	}
}

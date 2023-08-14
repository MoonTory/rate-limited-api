import { authJWT, rateLimiter } from '../../../middleware';
import { EndpointFunction } from '../../../../typings';

export class BucketWeightFiveEndpoint extends EndpointFunction {
	constructor() {
		super([authJWT(), rateLimiter(5, 'tokenBucket')]);
	}

	protected async executeImpl(): Promise<void | any> {
		try {
			return this.ok({ message: 'BucketWeightFiveEndpoint', status: 200 });
		} catch (error) {
			this.next(error);
		}
	}
}

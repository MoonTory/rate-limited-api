import { authJWT, rateLimiter } from '../../../middleware';
import { EndpointFunction } from '../../../../typings';

export class BucketWeightTwoEndpoint extends EndpointFunction {
	constructor() {
		super([authJWT(), rateLimiter(2, 'tokenBucket')]);
	}

	protected async executeImpl(): Promise<void | any> {
		try {
			return this.ok({ message: 'BucketWeightTwoEndpoint', status: 200 });
		} catch (error) {
			this.next(error);
		}
	}
}

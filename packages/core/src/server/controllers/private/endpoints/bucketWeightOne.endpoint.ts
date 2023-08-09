import { authJWT, rateLimitBucket } from '../../../middleware';
import { EndpointFunction } from '../../../../typings';

export class BucketWeightOneEndpoint extends EndpointFunction {
	constructor() {
		super([authJWT(), rateLimitBucket()]);
	}

	protected async executeImpl(): Promise<void | any> {
		try {
			return this.ok({ message: 'BucketWeightOneEndpoint', status: 200 });
		} catch (error) {
			this.next(error);
		}
	}
}

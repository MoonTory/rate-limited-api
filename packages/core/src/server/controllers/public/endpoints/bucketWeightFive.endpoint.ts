import { rateLimitBucket } from '../../../middleware';
import { EndpointFunction } from '../../../../typings';

export class BucketWeightFiveEndpoint extends EndpointFunction {
	constructor() {
		super([rateLimitBucket(5)]);
	}

	protected async executeImpl(): Promise<void | any> {
		try {
			return this.ok({ message: 'BucketWeightFiveEndpoint', status: 200 });
		} catch (error) {
			this.next(error);
		}
	}
}

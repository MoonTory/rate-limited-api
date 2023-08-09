import { rateLimitBucket } from '../../../middleware';
import { EndpointFunction } from '../../../../typings';

export class BucketWeightTwoEndpoint extends EndpointFunction {
	constructor() {
		super([rateLimitBucket(2)]);
	}

	protected async executeImpl(): Promise<void | any> {
		try {
			return this.ok({ message: 'BucketWeightTwoEndpoint', status: 200 });
		} catch (error) {
			this.next(error);
		}
	}
}

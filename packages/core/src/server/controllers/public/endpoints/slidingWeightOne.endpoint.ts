import { rateLimiter } from '../../../middleware';
import { EndpointFunction } from '../../../../typings';

export class SlidingWeightOneEndpoint extends EndpointFunction {
	constructor() {
		super([rateLimiter(1, 'slidingWindow')]);
	}

	protected async executeImpl(): Promise<void | any> {
		try {
			return this.ok({ message: 'SlidingWeightOneEndpoint', status: 200 });
		} catch (error) {
			this.next(error);
		}
	}
}

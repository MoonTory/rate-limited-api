import { rateLimiter } from '../../../middleware';
import { EndpointFunction } from '../../../../typings';

export class SlidingWeightTwoEndpoint extends EndpointFunction {
	constructor() {
		super([rateLimiter(2, 'slidingWindow')]);
	}

	protected async executeImpl(): Promise<void | any> {
		try {
			return this.ok({ message: 'SlidingWeightTwoEndpoint' });
		} catch (error) {
			this.next(error);
		}
	}
}

import { rateLimit } from '../../../middleware';
import { EndpointFunction } from '../../../../typings';

export class PublicWeightFiveEndpoint extends EndpointFunction {
	constructor() {
		super([rateLimit(5)]);
	}

	protected async executeImpl(): Promise<void | any> {
		try {
			return this.ok({ message: 'PublicWeightFiveEndpoint' });
		} catch (error) {
			this.next(error);
		}
	}
}

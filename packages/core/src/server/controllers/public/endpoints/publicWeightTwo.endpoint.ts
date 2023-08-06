import { rateLimit } from '../../../middleware';
import { EndpointFunction } from '../../../../typings';

export class PublicWeightTwoEndpoint extends EndpointFunction {
	constructor() {
		super([rateLimit(2)]);
	}

	protected async executeImpl(): Promise<void | any> {
		try {
			return this.ok({ message: 'PublicWeightTwoEndpoint' });
		} catch (error) {
			this.next(error);
		}
	}
}

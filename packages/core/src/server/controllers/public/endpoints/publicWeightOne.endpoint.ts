import { rateLimit } from '../../../middleware';
import { EndpointFunction } from '../../../../typings';

export class PublicWeightOneEndpoint extends EndpointFunction {
	constructor() {
		super([rateLimit(1)]);
	}

	protected async executeImpl(): Promise<void | any> {
		try {
			return this.ok({ message: 'PublicWeightOneEndpoint' });
		} catch (error) {
			this.next(error);
		}
	}
}

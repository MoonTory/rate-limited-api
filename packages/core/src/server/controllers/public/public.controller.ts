import { PublicEndpoints } from './endpoints';
import { IController, IConfig, EndpointMap } from '../../../typings';

export default class PublicController extends IController {
	private readonly _endpoints: EndpointMap;

	constructor(path: string, config: IConfig) {
		super(path, config);
		this._endpoints = {
			one: new PublicEndpoints.PublicWeightOneEndpoint(),
			two: new PublicEndpoints.PublicWeightTwoEndpoint(),
			five: new PublicEndpoints.PublicWeightFiveEndpoint()
		};

		this.init();
	}

	public async init() {
		this.router.get(this._path + '/one', ...this._endpoints['one'].middlewares, this._endpoints['one'].execute());
		this.router.get(this._path + '/two', ...this._endpoints['two'].middlewares, this._endpoints['two'].execute());
		this.router.get(this._path + '/five', ...this._endpoints['five'].middlewares, this._endpoints['five'].execute());

		console.log(this._path + ' ' + 'Initialized successfully...');
	}
}

import { PublicEndpoints } from './endpoints';
import { IController, IConfig, EndpointMap } from '../../../typings';

export default class PublicController extends IController {
	private readonly _endpoints: EndpointMap;

	constructor(path: string, config: IConfig) {
		super(path, config);
		this._endpoints = {
			fixedOne: new PublicEndpoints.FixedWeightOneEndpoint(),
			fixedTwo: new PublicEndpoints.FixedWeightTwoEndpoint(),
			fixedFive: new PublicEndpoints.FixedWeightFiveEndpoint(),
			slidingOne: new PublicEndpoints.SlidingWeightOneEndpoint(),
			slidingTwo: new PublicEndpoints.SlidingWeightTwoEndpoint(),
			slidingFive: new PublicEndpoints.SlidingWeightFiveEndpoint(),
			bucketOne: new PublicEndpoints.BucketWeightOneEndpoint(),
			bucketTwo: new PublicEndpoints.BucketWeightTwoEndpoint(),
			bucketFive: new PublicEndpoints.BucketWeightFiveEndpoint()
		};

		this.init();
	}

	public async init() {
		this.router.get(this._path + '/fixed/one', ...this._endpoints['fixedOne'].middlewares, this._endpoints['fixedOne'].execute());
		this.router.get(this._path + '/fixed/two', ...this._endpoints['fixedTwo'].middlewares, this._endpoints['fixedTwo'].execute());
		this.router.get(this._path + '/fixed/five', ...this._endpoints['fixedFive'].middlewares, this._endpoints['fixedFive'].execute());

		this.router.get(this._path + '/sliding/one', ...this._endpoints['slidingOne'].middlewares, this._endpoints['slidingOne'].execute());
		this.router.get(this._path + '/sliding/two', ...this._endpoints['slidingTwo'].middlewares, this._endpoints['slidingTwo'].execute());
		this.router.get(this._path + '/sliding/five', ...this._endpoints['slidingFive'].middlewares, this._endpoints['slidingFive'].execute());

		this.router.get(this._path + '/bucket/one', ...this._endpoints['bucketOne'].middlewares, this._endpoints['bucketOne'].execute());
		this.router.get(this._path + '/bucket/two', ...this._endpoints['bucketTwo'].middlewares, this._endpoints['bucketTwo'].execute());
		this.router.get(this._path + '/bucket/five', ...this._endpoints['bucketFive'].middlewares, this._endpoints['bucketFive'].execute());

		console.log(this._path + ' ' + 'Initialized successfully...');
	}
}

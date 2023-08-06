import mongoose from 'mongoose';

export abstract class MongooseRepository<T extends mongoose.Document> {
	protected _model: mongoose.Model<T>;

	constructor(model: mongoose.Model<T>) {
		this._model = model;
	}
}

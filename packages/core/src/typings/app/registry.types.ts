import { IDatabase } from '../db';

export interface IRepoRegistry {
	db: IDatabase<any>;
}

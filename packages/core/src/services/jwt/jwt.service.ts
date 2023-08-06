import jwt from 'jsonwebtoken';
import { v4 as uuid } from 'uuid';

import { config } from '../../config';

export class JWT {
	private static _instance: JWT;

	private constructor() {}

	public static getInstance(): JWT {
		if (!JWT._instance) {
			JWT._instance = new JWT();
		}
		return JWT._instance;
	}

	public generateToken = (): string => {
		return jwt.sign(
			{
				userId: uuid()
			},
			config.JWT_SECRET
		);
	};
}

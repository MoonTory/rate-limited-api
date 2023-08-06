import { ExtractJwt, Strategy, VerifiedCallback } from 'passport-jwt';

import { config } from '../../../../config';

export const JWTStrategy = () =>
	new Strategy(
		{ jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), secretOrKey: config.JWT_SECRET },
		async (payload: any, done: VerifiedCallback) => {
			try {
				let userIdentifier = payload.userId;

				if (!userIdentifier) {
					return done(null, false);
				}

				done(null, userIdentifier);
			} catch (error) {
				done(error, false);
			}
		}
	);

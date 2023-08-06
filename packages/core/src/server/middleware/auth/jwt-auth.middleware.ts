import passport from 'passport';

import { JWTStrategy } from './stratagies/jwt';
import { Middleware } from '../../../typings';

export const authJWT: Middleware = () => {
	passport.use(JWTStrategy());

	return passport.authenticate('jwt', { session: false });
};

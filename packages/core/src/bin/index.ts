import { MicroApp } from '../app';
import { config } from '../config';

(async (): Promise<void> => {
	const app = new MicroApp(config);
	await app.start();
})();

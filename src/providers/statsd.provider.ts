import { Provider } from '@nestjs/common';
import { StatsD } from 'hot-shots';
import { MODULE_OPTIONS_TOKEN } from '../hot-shots.module-definition';

export const StatsDProvider: Provider<StatsD> = {
	provide: StatsD,
	useFactory: options => {
		return new StatsD(options);
	},
	inject: [MODULE_OPTIONS_TOKEN]
};

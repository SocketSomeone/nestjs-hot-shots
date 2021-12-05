import { StatsD } from 'hot-shots';
import { Inject, Injectable } from '@nestjs/common';
import { MODULE_OPTIONS } from './hot-shots.constants';
import { HotShotsModuleOptions } from './hot-shots-options.interface';

@Injectable()
export class HotShotsService extends StatsD {
	public constructor(
		@Inject(MODULE_OPTIONS)
		private readonly options: HotShotsModuleOptions
	) {
		super(options);
	}
}

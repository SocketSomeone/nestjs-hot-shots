import { StatsD, Tags } from 'hot-shots';

import { CollectorOptions } from '../interfaces/index.js';

export abstract class BaseCollector {
	public constructor(
		protected readonly statsd: StatsD,
		protected readonly name: string,
		protected readonly options: CollectorOptions = { tags: {} }
	) {}

	protected getMergedTags(tags?: Tags): Tags {
		if (Array.isArray(tags)) {
			const optionTags = Object.entries(this.options.tags).map(
				([key, value]) => `${key}:${value}`
			);

			return [...optionTags, ...tags];
		}

		return {
			...this.options.tags,
			...tags
		};
	}
}

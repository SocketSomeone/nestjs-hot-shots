import { StatsD, Tags } from 'hot-shots';
import { CollectorOptions } from '../interfaces';

export abstract class BaseCollector {
	public constructor(
		protected readonly statsd: StatsD,
		protected readonly name: string,
		protected readonly options: CollectorOptions = { tags: {} }
	) {}

	protected getMergedTags(tags?: Tags): Tags {
		return {
			...this.options.tags,
			...(tags || {})
		};
	}
}

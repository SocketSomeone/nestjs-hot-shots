import { Tags } from 'hot-shots';

import { BaseCollector } from './base.collector';

export class TimingCollector extends BaseCollector {
	/**
	 * Record value of timing by the input. Inputs can be negative.
	 * @param value
	 * @param tags
	 */
	public record(value: number, tags?: Tags): void {
		this.statsd.timing(this.name, value, this.getMergedTags(tags));
	}
}

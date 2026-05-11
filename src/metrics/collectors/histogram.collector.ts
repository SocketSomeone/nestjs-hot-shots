import { Tags } from 'hot-shots';

import { BaseCollector } from './base.collector';

export class HistogramCollector extends BaseCollector {
	/**
	 * Record value of histogram by the input. Inputs can be negative.
	 * @param value
	 * @param tags
	 */
	public record(value: number, tags?: Tags): void {
		this.statsd.histogram(this.name, value, this.getMergedTags(tags));
	}
}

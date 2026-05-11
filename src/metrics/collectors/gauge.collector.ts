import { Tags } from 'hot-shots';

import { BaseCollector } from './base.collector';

export class GaugeCollector extends BaseCollector {
	/**
	 * Set value of gauge to the input. Inputs can be negative.
	 * @param value
	 * @param tags
	 */
	public set(value: number, tags?: Tags): void {
		this.statsd.gauge(this.name, value, this.getMergedTags(tags));
	}
}

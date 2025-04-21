import { Tags } from 'hot-shots';
import { BaseCollector } from './base.collector';

export class UpDownCounterCollector extends BaseCollector {
	/**
	 * Increment or decrement value of counter by the input. Inputs can be negative.
	 * @param value
	 * @param tags
	 */
	public add(value: number = 1, tags?: Tags): void {
		const mergedTags = this.getMergedTags(tags);

		if (value < 0) {
			this.statsd.decrement(this.name, Math.abs(value), mergedTags);
		} else {
			this.statsd.increment(this.name, value, mergedTags);
		}
	}
}

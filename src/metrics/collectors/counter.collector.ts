import { BaseCollector } from './base.collector';
import { RuntimeException } from '@nestjs/core/errors/exceptions';
import { Tags } from '../interfaces';

export class CounterCollector extends BaseCollector {
	/**
	 * Increment value of counter by the input. Inputs must not be negative.
	 * @param value
	 * @param tags
	 */
	public add(value: number = 1, tags?: Tags): void {
		if (value < 0) {
			throw new RuntimeException('Counter value cannot be negative');
		}

		this.statsd.increment(this.name, value, this.getMergedTags(tags));
	}
}

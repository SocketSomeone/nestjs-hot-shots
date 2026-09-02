import { RuntimeException } from '@nestjs/core/errors/exceptions/runtime.exception.js';

import { BaseCollector } from './base.collector.js';
import { Tags } from '../interfaces/index.js';

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

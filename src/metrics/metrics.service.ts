import { Injectable, Logger, Type } from '@nestjs/common';
import { StatsD } from 'hot-shots';
import {
	BaseCollector,
	CounterCollector,
	GaugeCollector,
	HistogramCollector,
	TimingCollector,
	UpDownCounterCollector
} from './collectors';
import { CollectorOptions } from './interfaces';

@Injectable()
export class MetricsService {
	private readonly logger = new Logger(MetricsService.name);

	private readonly cache = new Map<string, BaseCollector>();

	public constructor(private readonly statsd: StatsD) {}

	public getCounter(name: string, options?: CollectorOptions): CounterCollector {
		return this.getOrCreate(CounterCollector, name, options);
	}

	public getGauge(name: string, options?: CollectorOptions): GaugeCollector {
		return this.getOrCreate(GaugeCollector, name, options);
	}

	public getHistogram(name: string, options?: CollectorOptions): HistogramCollector {
		return this.getOrCreate(HistogramCollector, name, options);
	}

	public getTiming(name: string, options?: CollectorOptions): TimingCollector {
		return this.getOrCreate(TimingCollector, name, options);
	}

	public getUpDownCounter(name: string, options?: CollectorOptions): UpDownCounterCollector {
		return this.getOrCreate(UpDownCounterCollector, name, options);
	}

	private getOrCreate<T extends BaseCollector>(
		clazz: Type<T>,
		name: string,
		options?: CollectorOptions
	): T {
		const cacheKey = [clazz.name, name].join(':');

		if (this.cache.has(cacheKey)) {
			this.logger.warn(
				`Collector ${clazz.name} with name ${name} already exists. Returning cached instance.`
			);
			return this.cache.get(cacheKey) as T;
		}

		const instance = new clazz(this.statsd, name, options);
		this.cache.set(cacheKey, instance);
		return instance;
	}
}

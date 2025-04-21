import {
	CounterCollector,
	GaugeCollector,
	HistogramCollector,
	HotShotsModule,
	MetricsService,
	TimingCollector, UpDownCounterCollector
} from '../../src';
import { Test } from '@nestjs/testing';

describe('MetricsService', () => {
	let service: MetricsService;

	beforeEach(async () => {
		const moduleRef = await Test.createTestingModule({
			imports: [HotShotsModule.forRoot({ mock: true })]
		}).compile();

		service = moduleRef.get(MetricsService);
	});

	it('should be defined', () => {
		expect(service).toBeDefined();
	});

	it.each([
		{ instance: CounterCollector, name: 'CounterCollector' },
		{ instance: GaugeCollector, name: 'GaugeCollector' },
		{ instance: HistogramCollector, name: 'HistogramCollector' },
		{ instance: TimingCollector, name: 'TimingCollector' },
		{ instance: UpDownCounterCollector, name: 'UpDownCounterCollector' }
	])('should create $name', ({ instance: CollectorClass, name: collectorName }) => {
		const instance = service[`get${collectorName.replace('Collector', '')}`]('test.metric');
		expect(instance).toBeDefined();
		expect(instance).toBeInstanceOf(CollectorClass);
	});

	it('should cache instances', () => {
		const instance1 = service.getCounter('test.metric');
		const instance2 = service.getCounter('test.metric');

		expect(instance1).toBe(instance2);
	});

	it('should create different instances for different metrics', () => {
		const instance1 = service.getCounter('test.metric1');
		const instance2 = service.getCounter('test.metric2');

		expect(instance1).not.toBe(instance2);
	});

	it('should create different instances for different collectors', () => {
		const instance1 = service.getCounter('test.metric');
		const instance2 = service.getGauge('test.metric');

		expect(instance1).not.toBe(instance2);
	});

	afterEach(() => {
		jest.clearAllMocks();
	})
});

import { StatsD } from 'hot-shots';
import { GaugeCollector, HotShotsModule, MetricsService } from '../../../src';
import { Test } from '@nestjs/testing';

describe('GaugeCollector', () => {
	let statsD: StatsD, metricsService: MetricsService;

	beforeEach(async () => {
		const moduleRef = await Test.createTestingModule({
			imports: [HotShotsModule.forRoot({ mock: true })]
		}).compile();

		statsD = moduleRef.get(StatsD);
		metricsService = moduleRef.get(MetricsService);
	});

	it('should be defined', () => {
		expect(statsD).toBeDefined();
		expect(metricsService).toBeDefined();
	});

	it('should create GaugeCollector', () => {
		const instance = metricsService.getGauge('test.metric');
		expect(instance).toBeDefined();
		expect(instance).toBeInstanceOf(GaugeCollector);
	});

	it('should set gauge value', () => {
		const instance = metricsService.getGauge('test.metric');
		instance.set(10);

		expect(statsD.mockBuffer[0]).toBe('test.metric:10|g');
	});

	it('should set gauge value with tags', () => {
		const instance = metricsService.getGauge('test.metric');
		instance.set(10, { tag1: 'value1', tag2: 'value2' });

		expect(statsD.mockBuffer[0]).toBe('test.metric:10|g|#tag1:value1,tag2:value2');
	});

	it('should set gauge value with merge tags', () => {
		const instance = metricsService.getGauge('test.metric', { tags: { tag1: 'value1' } });
		instance.set(10, { tag2: 'value2' });

		expect(statsD.mockBuffer[0]).toBe('test.metric:10|g|#tag1:value1,tag2:value2');
	});

	afterEach(() => {
		jest.clearAllMocks();
	});
});

import { StatsD } from 'hot-shots';
import { HistogramCollector, HotShotsModule, MetricsService } from '../../../src';
import { Test } from '@nestjs/testing';

describe('HistogramCollector', () => {
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

	it('should create HistogramCollector', () => {
		const instance = metricsService.getHistogram('test.metric');
		expect(instance).toBeDefined();
		expect(instance).toBeInstanceOf(HistogramCollector);
	});

	it('should record histogram value', () => {
		const instance = metricsService.getHistogram('test.metric');
		instance.record(10);

		expect(statsD.mockBuffer[0]).toBe('test.metric:10|h');
	});

	it('should record histogram value with tags', () => {
		const instance = metricsService.getHistogram('test.metric');
		instance.record(10, { tag1: 'value1', tag2: 'value2' });

		expect(statsD.mockBuffer[0]).toBe('test.metric:10|h|#tag1:value1,tag2:value2');
	});

	it('should record histogram value with merge tags', () => {
		const instance = metricsService.getHistogram('test.metric', { tags: { tag1: 'value1' } });
		instance.record(10, { tag2: 'value2' });

		expect(statsD.mockBuffer[0]).toBe('test.metric:10|h|#tag1:value1,tag2:value2');
	});

	afterEach(() => {
		jest.clearAllMocks();
	});
})

import { StatsD } from 'hot-shots';
import { TimingCollector, HotShotsModule, MetricsService } from '../../../src';
import { Test } from '@nestjs/testing';

describe('TimingCollector', () => {
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

	it('should create TimingCollector', () => {
		const instance = metricsService.getTiming('test_metric');
		expect(instance).toBeDefined();
		expect(instance).toBeInstanceOf(TimingCollector);
	});

	it('should record timing value', () => {
		const instance = metricsService.getTiming('test_metric');
		instance.record(10);

		expect(statsD.mockBuffer[0]).toBe('test_metric:10|ms');
	});

	it('should record timing value with tags', () => {
		const instance = metricsService.getTiming('test_metric');
		instance.record(10, { tag1: 'value1', tag2: 'value2' });

		expect(statsD.mockBuffer[0]).toBe('test_metric:10|ms|#tag1:value1,tag2:value2');
	});

	it('should record timing value with merge tags', () => {
		const instance = metricsService.getTiming('test_metric', { tags: { tag1: 'value1' } });
		instance.record(10, { tag2: 'value2' });

		expect(statsD.mockBuffer[0]).toBe('test_metric:10|ms|#tag1:value1,tag2:value2');
	});

	afterEach(() => {
		jest.clearAllMocks();
	});
})

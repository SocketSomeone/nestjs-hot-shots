import { UpDownCounterCollector, HotShotsModule, MetricsService } from '../../../src';
import { Test } from '@nestjs/testing';
import { StatsD } from 'hot-shots';

describe('UpDownCounterCollector', () => {
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

	it('should create UpDownCounterCollector', () => {
		const instance = metricsService.getUpDownCounter('test_metric');
		expect(instance).toBeDefined();
		expect(instance).toBeInstanceOf(UpDownCounterCollector);
	});

	it('should increment counter', () => {
		const instance = metricsService.getUpDownCounter('test_metric');
		instance.add(1);

		expect(statsD.mockBuffer[0]).toBe('test_metric:1|c');
	});

	it('should increment counter with tags', () => {
		const instance = metricsService.getUpDownCounter('test_metric');
		instance.add(1, { tag1: 'value1', tag2: 'value2' });

		expect(statsD.mockBuffer[0]).toBe('test_metric:1|c|#tag1:value1,tag2:value2');
	});

	it('should increment counter with merge tags', () => {
		const instance = metricsService.getUpDownCounter('test_metric', {
			tags: { tag1: 'value1' }
		});
		instance.add(1, { tag2: 'value2' });

		expect(statsD.mockBuffer[0]).toBe('test_metric:1|c|#tag1:value1,tag2:value2');
	});

	it('should decrement counter', () => {
		const instance = metricsService.getUpDownCounter('test_metric');
		instance.add(-1);

		expect(statsD.mockBuffer[0]).toBe('test_metric:-1|c');
	});

	it('should increment and decrement counter', () => {
		const instance = metricsService.getUpDownCounter('test_metric');
		instance.add(1);
		instance.add(-1);

		expect(statsD.mockBuffer[0]).toBe('test_metric:1|c');
		expect(statsD.mockBuffer[1]).toBe('test_metric:-1|c');
	});

	afterEach(() => {
		jest.clearAllMocks();
	});
});

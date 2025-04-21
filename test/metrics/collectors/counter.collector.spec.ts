import { CounterCollector, HotShotsModule, MetricsService } from '../../../src';
import { Test } from '@nestjs/testing';
import { StatsD } from 'hot-shots';

describe('CounterCollector', () => {
	let statsD: StatsD,
		metricsService: MetricsService;

	beforeEach(async () => {
		const moduleRef = await Test.createTestingModule({
			imports: [HotShotsModule.forRoot({ mock: true })]
		}).compile();

		statsD = moduleRef.get(StatsD);
		metricsService = moduleRef.get(MetricsService);
	})

	it('should be defined', () => {
		expect(statsD).toBeDefined();
		expect(metricsService).toBeDefined();
	});

	it('should create CounterCollector', () => {
		const instance = metricsService.getCounter('test.metric');
		expect(instance).toBeDefined();
		expect(instance).toBeInstanceOf(CounterCollector);
	});

	it('should increment counter', () => {
		const instance = metricsService.getCounter('test.metric');
		instance.add(1);

		expect(statsD.mockBuffer[0]).toBe('test.metric:1|c');
	});

	it('should increment counter with tags', () => {
		const instance = metricsService.getCounter('test.metric');
		instance.add(1, { tag1: 'value1', tag2: 'value2' });

		expect(statsD.mockBuffer[0]).toBe('test.metric:1|c|#tag1:value1,tag2:value2');
	});

	it('should increment counter with merge tags', () => {
		const instance = metricsService.getCounter('test.metric', { tags: { tag1: 'value1' } });
		instance.add(1, { tag2: 'value2' });

		expect(statsD.mockBuffer[0]).toBe('test.metric:1|c|#tag1:value1,tag2:value2');
	});

	it('should throw error when incrementing with negative value', () => {
		const instance = metricsService.getCounter('test.metric');
		expect(() => instance.add(-1)).toThrowError('Counter value cannot be negative');
	});


	afterEach(() => {
		jest.clearAllMocks();
	})
})

const StatsDMock = jest.fn();

jest.mock('hot-shots', () => ({
	StatsD: StatsDMock
}));

import { Test } from '@nestjs/testing';
import { HotShotsModule } from '../src';
import { StatsD } from 'hot-shots';

describe('HotShotsModule', () => {
	beforeEach(() => {
		StatsDMock.mockClear();
	});

	it('should provide StatsD', async () => {
		const options = { host: '127.0.0.1', mock: true };

		const moduleRef = await Test.createTestingModule({
			imports: [HotShotsModule.forRoot(options)]
		}).compile();

		const statsDProvider = moduleRef.get(StatsD);
		expect(statsDProvider).toBeDefined();
		expect(StatsDMock).toHaveBeenCalledWith(expect.objectContaining(options));
	});
});

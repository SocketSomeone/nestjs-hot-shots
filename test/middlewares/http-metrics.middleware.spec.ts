import { StatsD } from 'hot-shots';
import { Controller, Get, INestApplication, Param, Res } from '@nestjs/common';
import { HotShotsModule, MetricsService } from '../../src';
import { Test } from '@nestjs/testing';
import { HttpMetricsMiddleware } from '../../src';
import * as request from 'supertest';
import { Response } from 'express';

@Controller()
class AppController {
	@Get('/:statusCode')
	getHello(@Res() res: Response, @Param('statusCode') statusCode: string) {
		return res.status(parseInt(statusCode)).json([]);
	}
}

describe('HttpMetricsMiddleware', () => {
	let app: INestApplication;
	let statsD: StatsD;
	let httpMetricsMiddleware: HttpMetricsMiddleware;
	let metricsService: MetricsService;

	beforeAll(async () => {
		const moduleRef = await Test.createTestingModule({
			imports: [HotShotsModule.forRoot({ mock: true })],
			controllers: [AppController]
		}).compile();

		app = moduleRef.createNestApplication();
		statsD = moduleRef.get(StatsD);
		metricsService = moduleRef.get(MetricsService);

		httpMetricsMiddleware = new HttpMetricsMiddleware(metricsService);
		app.use(httpMetricsMiddleware.use.bind(httpMetricsMiddleware));

		await app.init();
	});

	it('should be defined', () => {
		expect(app).toBeDefined();
		expect(httpMetricsMiddleware).toBeDefined();
		expect(metricsService).toBeDefined();
	});

	it('should call metricsService.getCounter and metricsService.getHistogram', () => {
		jest.spyOn(metricsService, 'getCounter');
		jest.spyOn(metricsService, 'getHistogram');

		const middleware = new HttpMetricsMiddleware(metricsService);

		expect(metricsService.getCounter).toHaveBeenCalledWith('http_server_request_count');
		expect(metricsService.getHistogram).toHaveBeenCalledTimes(3);
	});

	describe('metric: http.server.request.count', () => {
		it('successfully request records', async () => {
			return request(app.getHttpServer())
				.get('/200')
				.expect(200)
				.then(res => {
					expect(statsD.mockBuffer[0]).toBe(
						'http_server_request_count:1|c|#method:GET,path:/:statusCode'
					);
				});
		});
	});

	describe('metric: http.server.response.count', () => {
		it('successfully request records', async () => {
			return request(app.getHttpServer())
				.get('/200')
				.expect(200)
				.then(res => {
					expect(statsD.mockBuffer[3]).toBe(
						'http_server_response_count:1|c|#method:GET,status:200,path:/:statusCode'
					);
				});
		});
	});

	describe('metric: http.server.abort.count', () => {});

	describe('metric: http.server.duration', () => {});

	describe('metric: http.server.request.size', () => {});

	describe('metric: http.server.response.size', () => {});

	describe('metric: http.server.response.success.count', () => {});

	describe('metric: http.server.response.error.count', () => {
		it('error request records', async () => {
			return request(app.getHttpServer())
				.get('/500')
				.expect(500)
				.then(res => {
					expect(statsD.mockBuffer[5]).toBe('http_server_response_error_count:1|c');
				});
		});
	});

	describe('metric: http.client.request.error.count', () => {
		it('error request records', async () => {
			return request(app.getHttpServer())
				.get('/invalid/route')
				.then(res => {
					expect(statsD.mockBuffer[5]).toBe('http_client_request_error_count:1|c');
				});
		});
	});

	afterEach(() => {
		jest.clearAllMocks();
		statsD.mockBuffer = [];
	});

	afterAll(async () => {
		await app.close();
	});
});

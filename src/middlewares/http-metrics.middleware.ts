import * as urlParser from 'url';
import * as responseTime from 'response-time';
import { Injectable, NestMiddleware } from '@nestjs/common';
import { MetricsService } from '../metrics';

@Injectable()
export class HttpMetricsMiddleware implements NestMiddleware {
	private httpServerRequestCount = this.metricsService.getCounter('http_server_request_count');

	private httpServerResponseCount = this.metricsService.getCounter('http_server_response_count');

	private httpServerDuration = this.metricsService.getHistogram('http_server_duration');

	private httpServerRequestSize = this.metricsService.getHistogram('http_server_request_size');

	private httpServerResponseSize = this.metricsService.getHistogram('http_server_response_size');

	private httpServerResponseSuccessCount = this.metricsService.getCounter(
		'http_server_response_success_count'
	);

	private httpServerResponseErrorCount = this.metricsService.getCounter(
		'http_server_response_error_count'
	);

	private httpClientRequestErrorCount = this.metricsService.getCounter(
		'http_client_request_error_count'
	);

	private httpServerAbortCount = this.metricsService.getCounter('http_server_abort_count');

	public constructor(private readonly metricsService: MetricsService) {}

	use(req: any, res: any, next: (error?: any) => void) {
		responseTime((req: any, res: any, time: number) => {
			const { route, url, method } = req;
			let path;

			if (route) {
				path = route.path;
			} else {
				path = urlParser.parse(url).pathname;
			}

			this.httpServerRequestCount.add(1, { method, path });

			const requestLength = parseInt(req.headers['content-length'], 10) || 0;
			const responseLength: number = parseInt(res.getHeader('Content-Length'), 10) || 0;

			const status = res.statusCode || 500;
			const attributes = {
				method,
				status,
				path
			};

			this.httpServerRequestSize.record(requestLength, attributes);
			this.httpServerResponseSize.record(responseLength, attributes);

			this.httpServerResponseCount.add(1, attributes);
			this.httpServerDuration.record(time, attributes);

			const codeClass = this.getStatusCodeClass(status);

			switch (codeClass) {
				case 'success':
					this.httpServerResponseSuccessCount.add(1);
					break;
				case 'redirect':
					// TODO: Review what should be appropriate for redirects.
					this.httpServerResponseSuccessCount.add(1);
					break;
				case 'client_error':
					this.httpClientRequestErrorCount.add(1);
					break;
				case 'server_error':
					this.httpServerResponseErrorCount.add(1);
					break;
			}

			req.on('end', () => {
				if (req.aborted === true) {
					this.httpServerAbortCount.add(1);
				}
			});
		})(req, res, next);
	}

	private getStatusCodeClass(code: number): string {
		if (code < 200) return 'info';
		if (code < 300) return 'success';
		if (code < 400) return 'redirect';
		if (code < 500) return 'client_error';
		return 'server_error';
	}
}

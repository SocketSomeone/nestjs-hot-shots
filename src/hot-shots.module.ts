import { Global, Module } from '@nestjs/common';

import { ConfigurableModuleClass } from './hot-shots.module-definition.js';
import { MetricsService } from './metrics/metrics.service.js';
import { StatsDProvider } from './providers/index.js';

@Global()
@Module({
	providers: [StatsDProvider, MetricsService],
	exports: [StatsDProvider, MetricsService]
})
export class HotShotsModule extends ConfigurableModuleClass {}

import { Global, Module } from '@nestjs/common';

import { ConfigurableModuleClass } from './hot-shots.module-definition';
import { MetricsService } from './metrics/metrics.service';
import { StatsDProvider } from './providers';

@Global()
@Module({
	providers: [StatsDProvider, MetricsService],
	exports: [StatsDProvider, MetricsService]
})
export class HotShotsModule extends ConfigurableModuleClass {}

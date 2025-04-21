import { Global, Module } from '@nestjs/common';
import { StatsDProvider } from './providers';
import { ConfigurableModuleClass } from './hot-shots.module-definition';
import { MetricsService } from './metrics/metrics.service';

@Global()
@Module({
	providers: [StatsDProvider, MetricsService],
	exports: [StatsDProvider, MetricsService]
})
export class HotShotsModule extends ConfigurableModuleClass {}

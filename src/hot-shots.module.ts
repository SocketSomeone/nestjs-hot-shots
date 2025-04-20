import { Global, Module } from '@nestjs/common';
import { StatsDProvider } from './providers';
import { ConfigurableModuleClass } from './hot-shots.module-definition';

@Global()
@Module({
	providers: [StatsDProvider],
	exports: [StatsDProvider]
})
export class HotShotsModule extends ConfigurableModuleClass {}

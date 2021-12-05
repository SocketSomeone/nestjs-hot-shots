import { DynamicModule, Module, Provider } from '@nestjs/common';
import {
	HotShotsModuleAsyncOptions,
	HotShotsModuleOptions,
	HotShotsOptionsFactory
} from './hot-shots-options.interface';
import { MODULE_OPTIONS } from './hot-shots.constants';
import { HotShotsService } from './hot-shots.service';

@Module({
	providers: [HotShotsService],
	exports: [HotShotsService]
})
export class HotShotsModule {
	public static forRoot(options: HotShotsModuleOptions): DynamicModule {
		return {
			module: HotShotsModule,
			providers: [
				{
					provide: MODULE_OPTIONS,
					useValue: options
				}
			]
		};
	}

	public static forRootAsync(options: HotShotsModuleAsyncOptions): DynamicModule {
		return {
			module: HotShotsModule,
			imports: options.imports,
			providers: this.createAsyncProviders(options)
		};
	}

	private static createAsyncProviders(options: HotShotsModuleAsyncOptions): Provider[] {
		if (options.useExisting || options.useFactory) {
			return [this.createAsyncOptionsProvider(options)];
		}

		return [
			this.createAsyncOptionsProvider(options),
			{
				provide: options.useClass,
				useClass: options.useClass
			}
		];
	}

	private static createAsyncOptionsProvider(options: HotShotsModuleAsyncOptions): Provider {
		if (options.useFactory) {
			return {
				provide: MODULE_OPTIONS,
				useFactory: async (...args: any[]) => await options.useFactory(...args),
				inject: options.inject || []
			};
		}

		return {
			provide: MODULE_OPTIONS,
			useFactory: async (optionsFactory: HotShotsOptionsFactory) =>
				await optionsFactory.createHotShotsOptions(),
			inject: [options.useExisting || options.useClass]
		};
	}
}

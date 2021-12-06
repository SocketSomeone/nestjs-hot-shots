import { DynamicModule, Module, Provider } from '@nestjs/common';
import {
	HotShotsModuleAsyncOptions,
	HotShotsModuleOptions,
	HotShotsOptionsFactory
} from './hot-shots-options.interface';
import { HOT_SHOTS_MODULE_OPTIONS } from './hot-shots.constants';
import { StatsD } from 'hot-shots';

@Module({})
export class HotShotsModule {
	public static forRoot(options: HotShotsModuleOptions): DynamicModule {
		const StatsDProvider: Provider<StatsD> = {
			provide: StatsD,
			useValue: new StatsD(options)
		};

		return {
			module: HotShotsModule,
			providers: [
				{
					provide: HOT_SHOTS_MODULE_OPTIONS,
					useValue: options
				},
				StatsDProvider
			],
			exports: [StatsDProvider]
		};
	}

	public static forRootAsync(options: HotShotsModuleAsyncOptions): DynamicModule {
		const StatsDFactoryProvider: Provider<StatsD> = {
			provide: StatsD,
			useFactory: (options: HotShotsModuleOptions) => new StatsD(options),
			inject: [HOT_SHOTS_MODULE_OPTIONS]
		};

		return {
			module: HotShotsModule,
			imports: options.imports,
			providers: this.createAsyncProviders(options).concat(StatsDFactoryProvider),
			exports: [StatsDFactoryProvider]
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
				provide: HOT_SHOTS_MODULE_OPTIONS,
				useFactory: async (...args: any[]) => await options.useFactory(...args),
				inject: options.inject || []
			};
		}

		return {
			provide: HOT_SHOTS_MODULE_OPTIONS,
			useFactory: async (optionsFactory: HotShotsOptionsFactory) =>
				await optionsFactory.createHotShotsOptions(),
			inject: [options.useExisting || options.useClass]
		};
	}
}

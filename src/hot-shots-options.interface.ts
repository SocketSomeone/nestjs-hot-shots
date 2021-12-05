import { ModuleMetadata, Type } from '@nestjs/common';
import { ClientOptions } from 'hot-shots';

export type HotShotsModuleOptions = ClientOptions;

export interface HotShotsOptionsFactory {
	createHotShotsOptions(): Promise<HotShotsModuleOptions> | HotShotsModuleOptions;
}

export interface HotShotsModuleAsyncOptions extends Pick<ModuleMetadata, 'imports'> {
	useExisting?: Type<HotShotsOptionsFactory>;
	useClass?: Type<HotShotsOptionsFactory>;
	useFactory?: (...args: any[]) => Promise<HotShotsModuleOptions> | HotShotsModuleOptions;
	inject?: any[];
}

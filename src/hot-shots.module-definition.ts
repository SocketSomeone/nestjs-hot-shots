import { ConfigurableModuleBuilder } from '@nestjs/common';
import { HotShotsModuleOptions } from './hot-shots-options.interface';

export const { ConfigurableModuleClass, MODULE_OPTIONS_TOKEN } =
	new ConfigurableModuleBuilder<HotShotsModuleOptions>()
		.setClassMethodName('forRoot')
		.setFactoryMethodName('createHotShotsOptions')
		.build();

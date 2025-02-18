import * as fs from 'fs';
import { resolve } from 'path';

import { DynamicModule, Module, Provider } from '@nestjs/common';
import { ConfigModuleOptions } from '@nestjs/config';
import * as dotenv from 'dotenv';
import { DotenvExpandOptions, expand } from 'dotenv-expand';

import { loadConfig } from '@/config/config.loader';
import { ConfigService } from '@/config/config.service';

@Module({})
export class ConfigModule {
  public static forRootAsync(options: ConfigModuleOptions = {}): DynamicModule {
    const provider: Provider = {
      provide: ConfigService,
      useFactory: async () => {
        const envFilePaths = Array.isArray(options.envFilePath)
          ? options.envFilePath
          : [options.envFilePath || resolve(process.cwd(), '.env')];
        let config = this.loadEnvFile(envFilePaths, options);
        if (!options.ignoreEnvVars) {
          config = {
            ...config,
            ...process.env,
          };
        }
        const record = await loadConfig(config);
        return new ConfigService(record);
      },
    };
    return {
      global: options.isGlobal,
      module: ConfigModule,
      providers: [provider],
      exports: [provider],
    };
  }

  private static loadEnvFile(
    envFilePaths: string[],
    options: ConfigModuleOptions,
  ): Record<string, any> {
    let config: ReturnType<typeof dotenv.parse> = {};
    for (const envFilePath of envFilePaths) {
      if (fs.existsSync(envFilePath)) {
        config = Object.assign(
          dotenv.parse(fs.readFileSync(envFilePath)),
          config,
        );
        if (options.expandVariables) {
          const expandOptions: DotenvExpandOptions =
            typeof options.expandVariables === 'object'
              ? options.expandVariables
              : {};
          config =
            expand({ ...expandOptions, parsed: config }).parsed || config;
        }
      }
    }
    return config;
  }
}

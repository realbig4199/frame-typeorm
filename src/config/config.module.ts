import * as fs from 'fs';
import { resolve } from 'path';

import { Module } from '@nestjs/common';
import * as dotenv from 'dotenv';

import { loadConfig } from '@/config/config.loader';
import { ConfigService } from '@/config/config.service';
import { ConfigModuleOptions } from '@nestjs/config';

@Module({})
export class ConfigModule {
  public static forRootAsync(options: ConfigModuleOptions = {}) {
    const provider = {
      provide: ConfigService,
      useFactory: async () => {
        // 플래그 추가
        const envFilePaths = Array.isArray(options.envFilePath)
          ? options.envFilePath
          : [options.envFilePath || resolve(process.cwd(), '.env')];

        const config = this.loadEnvFile(envFilePaths);

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

  private static loadEnvFile(envFilePaths: string[]): Record<string, any> {
    let config: ReturnType<typeof dotenv.parse> = {};
    for (const envFilePath of envFilePaths) {
      if (fs.existsSync(envFilePath)) {
        config = Object.assign(
          dotenv.parse(fs.readFileSync(envFilePath)),
          config,
        );
      }
    }
    return config;
  }
}

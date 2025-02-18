import { ConfigService } from '@/config/config.service';
import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

@Global()
@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        return {
          ...configService.get('database'),
          entities: [__dirname + '@/**/*.dao{.ts,.js}'],
          synchronize: false,
        };
      },
    }),
  ],
  providers: [],
  exports: [],
})
export class DatabaseModule {}

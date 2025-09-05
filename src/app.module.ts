import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ScheduleModule } from '@nestjs/schedule';
import { SwapService } from './shared/services/swap.service';
import { CronService } from './cron/cron.service';

@Module({
  imports: [
    ScheduleModule.forRoot()
  ],
  controllers: [AppController],
  providers: [AppService, SwapService, CronService],
})
export class AppModule {}

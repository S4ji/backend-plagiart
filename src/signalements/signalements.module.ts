import { Module } from '@nestjs/common'
import { SignalementService } from './signalements.service'
import { SignalementController } from './signalements.controller'

@Module({
    controllers: [SignalementController],
    providers: [SignalementService],
})
export class SignalementsModule {}

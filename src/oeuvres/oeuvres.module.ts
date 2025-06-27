import { Module } from '@nestjs/common';
import { OeuvresService } from './oeuvres.service';
import { OeuvresController } from './oeuvres.controller';


@Module({
  controllers: [OeuvresController],
  providers: [OeuvresService],
})
export class OeuvresModule {}

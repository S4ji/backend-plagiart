import { Test, TestingModule } from '@nestjs/testing';
import { OeuvresController } from './oeuvres.controller';
import { OeuvresService } from './oeuvres.service';

describe('OeuvresController', () => {
  let controller: OeuvresController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OeuvresController],
      providers: [OeuvresService],
    }).compile();

    controller = module.get<OeuvresController>(OeuvresController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

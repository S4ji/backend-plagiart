import { Test, TestingModule } from '@nestjs/testing';
import { OeuvresService } from './oeuvres.service';

describe('OeuvresService', () => {
  let service: OeuvresService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OeuvresService],
    }).compile();

    service = module.get<OeuvresService>(OeuvresService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

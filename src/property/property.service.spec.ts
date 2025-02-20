import { Test, TestingModule } from '@nestjs/testing';
import { PropertyService } from './property.service'; // Updated to PropertyService

describe('PropertyService', () => {
  let service: PropertyService; 

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PropertyService], // Updated to PropertyService
    }).compile();

    service = module.get<PropertyService>(PropertyService); // Updated to PropertyService
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
import { Test, TestingModule } from '@nestjs/testing';
import { PostsService } from './posts.service';

describe('PostsService', () => {
  let service: PostsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PostsService],
    }).compile();

    service = module.get<PostsService>(PostsService);
  });

  // kiểm tra PostsService đã được định nghĩa
  it('PostsService - should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getAll', () => {
    it('should get all post in the system', async () => {
      const all_post = await service.getAll();

      expect(all_post).toBeCalled();
    });
  });
});

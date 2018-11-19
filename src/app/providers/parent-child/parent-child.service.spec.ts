import { TestBed } from '@angular/core/testing';

import { ParentChildService } from './parent-child.service';

describe('ParentChildService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ParentChildService = TestBed.get(ParentChildService);
    expect(service).toBeTruthy();
  });
});

import { TestBed } from '@angular/core/testing';

import { LocalStorageTokenVoterService } from './local-storage-token-voter.service';

describe('LocalStorageTokenVoterService', () => {
  let service: LocalStorageTokenVoterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LocalStorageTokenVoterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

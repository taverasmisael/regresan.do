/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { KpisService } from './kpis.service';

describe('KpisService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [KpisService]
    });
  });

  it('should ...', inject([KpisService], (service: KpisService) => {
    expect(service).toBeTruthy();
  }));
});

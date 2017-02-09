/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { StaffService } from './staff.service';

describe('StaffService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [StaffService]
    });
  });

  it('should ...', inject([StaffService], (service: StaffService) => {
    expect(service).toBeTruthy();
  }));
});

/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { LocalStorage } from './localstorage.service';

describe('LocalStorage', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LocalStorage]
    });
  });

  it('should ...', inject([LocalStorage], (service: LocalStorage) => {
    expect(service).toBeTruthy();
  }));
});

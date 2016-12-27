/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { RespuestasService } from './respuestas.service';

describe('RespuestasService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RespuestasService]
    });
  });

  it('should ...', inject([RespuestasService], (service: RespuestasService) => {
    expect(service).toBeTruthy();
  }));
});

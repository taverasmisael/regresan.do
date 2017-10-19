/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { TotalesCardComponent } from './totales-card.component';

describe('TotalesCardComponent', () => {
  let component: TotalesCardComponent;
  let fixture: ComponentFixture<TotalesCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TotalesCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TotalesCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

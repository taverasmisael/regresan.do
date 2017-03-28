/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { StafRankingCardComponent } from './staf-ranking-card.component';

describe('StafRankingCardComponent', () => {
  let component: StafRankingCardComponent;
  let fixture: ComponentFixture<StafRankingCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StafRankingCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StafRankingCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

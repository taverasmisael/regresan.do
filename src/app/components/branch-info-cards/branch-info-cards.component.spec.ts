/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { BranchInfoCardsComponent } from './branch-info-cards.component';

describe('BranchInfoCardsComponent', () => {
  let component: BranchInfoCardsComponent;
  let fixture: ComponentFixture<BranchInfoCardsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BranchInfoCardsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BranchInfoCardsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

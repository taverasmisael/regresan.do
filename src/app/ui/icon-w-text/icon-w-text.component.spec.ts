/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { IconWTextComponent } from './icon-w-text.component';

describe('IconWTextComponent', () => {
  let component: IconWTextComponent;
  let fixture: ComponentFixture<IconWTextComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IconWTextComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IconWTextComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

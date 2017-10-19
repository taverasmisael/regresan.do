import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DoubleSelectComponent } from './double-select.component';

describe('DoubleSelectComponent', () => {
  let component: DoubleSelectComponent;
  let fixture: ComponentFixture<DoubleSelectComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DoubleSelectComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DoubleSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});

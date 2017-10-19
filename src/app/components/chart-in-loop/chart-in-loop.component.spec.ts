import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChartInLoopComponent } from './chart-in-loop.component';

describe('ChartInLoopComponent', () => {
  let component: ChartInLoopComponent;
  let fixture: ComponentFixture<ChartInLoopComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChartInLoopComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChartInLoopComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MyCurrencyInputControlComponent } from './my-currency-input-control.component';

describe('MyCurrencyInputControlComponent', () => {
  let component: MyCurrencyInputControlComponent;
  let fixture: ComponentFixture<MyCurrencyInputControlComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MyCurrencyInputControlComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyCurrencyInputControlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

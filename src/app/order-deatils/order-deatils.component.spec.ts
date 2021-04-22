import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderDeatilsComponent } from './order-deatils.component';

describe('OrderDeatilsComponent', () => {
  let component: OrderDeatilsComponent;
  let fixture: ComponentFixture<OrderDeatilsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OrderDeatilsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderDeatilsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

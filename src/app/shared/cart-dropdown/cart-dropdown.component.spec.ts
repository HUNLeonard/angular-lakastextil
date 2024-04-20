import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CartDropdownComponent } from './cart-dropdown.component';

describe('CartDropdownComponent', () => {
  let component: CartDropdownComponent;
  let fixture: ComponentFixture<CartDropdownComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CartDropdownComponent]
    });
    fixture = TestBed.createComponent(CartDropdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeliveryGestionComponent } from './delivery-gestion.component';

describe('DeliveryGestionComponent', () => {
  let component: DeliveryGestionComponent;
  let fixture: ComponentFixture<DeliveryGestionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeliveryGestionComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DeliveryGestionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

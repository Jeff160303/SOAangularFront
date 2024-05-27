import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormularioeditarComponent } from './formularioeditar.component';

describe('FormularioeditarComponent', () => {
  let component: FormularioeditarComponent;
  let fixture: ComponentFixture<FormularioeditarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormularioeditarComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FormularioeditarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DesconectadoComponent } from './desconectado.component';

describe('DesconectadoComponent', () => {
  let component: DesconectadoComponent;
  let fixture: ComponentFixture<DesconectadoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DesconectadoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DesconectadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

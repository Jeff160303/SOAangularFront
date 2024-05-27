import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EliminarproductosComponent } from './eliminarproductos.component';

describe('EliminarproductosComponent', () => {
  let component: EliminarproductosComponent;
  let fixture: ComponentFixture<EliminarproductosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EliminarproductosComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EliminarproductosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

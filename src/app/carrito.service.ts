import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CarritoService {
  private cantidadProductosEnCarritoSubject = new BehaviorSubject<number>(0);
  cantidadProductosEnCarrito$ = this.cantidadProductosEnCarritoSubject.asObservable();

  constructor() {}

  actualizarCantidadProductosEnCarrito(cantidad: number): void {
    this.cantidadProductosEnCarritoSubject.next(cantidad);
  }
}

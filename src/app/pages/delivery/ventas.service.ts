import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Venta } from '../../models/venta.model';
import { DetalleVenta } from '../../models/detalle-venta.model';

@Injectable({
  providedIn: 'root'
})
export class VentasService {
  private apiUrl = 'http://localhost:8020/ventas';

  constructor(private http: HttpClient) { }

  getVentas(): Observable<Venta[]> {
    return this.http.get<Venta[]>(`${this.apiUrl}`);
  }

  getVentasPorDni(dni: string): Observable<Venta[]> {
    return this.http.get<Venta[]>(`${this.apiUrl}/dni/${dni}`);
  }

  actualizarEstado(idVenta: number, estado: string): Observable<Venta> {
    const params = new HttpParams().set('estado', estado);
    return this.http.put<Venta>(`${this.apiUrl}/estado/${idVenta}`, {}, { params });
  }

  getDetallesDeVenta(idVenta: number): Observable<DetalleVenta[]> {
    return this.http.get<DetalleVenta[]>(`${this.apiUrl}/${idVenta}/detalles`);
  }

  enviarEmailActualizacionEstado(emailRequest: any): Observable<void> {
    return this.http.post<void>(`http://localhost:8060/email/actualizacion-estado`, emailRequest);
  }

  getUsuarioPorDni(dni: string): Observable<any> {
    return this.http.get<any>(`http://localhost:8090/usuarios/listarporDni/${dni}`);
  }
}

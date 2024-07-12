import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Venta } from '../../models/venta.model';
import { VentasService } from './ventas.service';
import { AuthService, UserData } from '../../auth.service';
import { DetalleVenta } from '../../models/detalle-venta.model';

@Component({
  selector: 'app-delivery',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './delivery.component.html',
  styleUrl: './delivery.component.css'
})
export class DeliveryComponent implements OnInit {
  ventas: Venta[] = [];
  ventasEntregadas: Venta[] = [];
  detalles: { [key: number]: DetalleVenta[] } = {};
  mostrarDetalles: { [key: number]: boolean } = {};
  mostrarComprasCompletadas: boolean = false;
  userData: UserData | null = null;

  constructor(private ventasService: VentasService, private authService: AuthService) {}

  ngOnInit(): void {
    this.authService.userData$.subscribe(userData => {
      this.userData = userData;
      if (this.userData) {
        this.obtenerVentasPorDni(this.userData.dni);
      }
    });
  }

  obtenerVentasPorDni(dni: string): void {
    this.ventasService.getVentasPorDni(dni).subscribe((ventas: Venta[]) => {
      this.ventas = ventas.filter(venta => venta.estado !== 'entregado');
      this.ventasEntregadas = ventas.filter(venta => venta.estado === 'entregado');
    });
  }

  obtenerDetallesDeVenta(idVenta: number): void {
    if (!this.detalles[idVenta]) {
      this.ventasService.getDetallesDeVenta(idVenta).subscribe((detalles: DetalleVenta[]) => {
        this.detalles[idVenta] = detalles;
      });
    }
    this.mostrarDetalles[idVenta] = !this.mostrarDetalles[idVenta];
  }

  toggleMostrarComprasCompletadas(): void {
    this.mostrarComprasCompletadas = !this.mostrarComprasCompletadas;
  }
}
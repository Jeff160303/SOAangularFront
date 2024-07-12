import { Component, OnInit } from '@angular/core';
import { Venta } from '../../../models/venta.model';
import { VentasService } from '../ventas.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-delivery-gestion',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './delivery-gestion.component.html',
  styleUrl: './delivery-gestion.component.css'
})
export class DeliveryGestionComponent implements OnInit {
  ventas: Venta[] = [];
  ventasPendientesEnCamino: Venta[] = [];
  ventasPendientesEnCaminoFiltradas: Venta[] = [];
  ventasEntregadas: Venta[] = [];
  estadosPosibles: string[] = ['pendiente', 'enviado', 'entregado'];
  terminoBusqueda: string = '';

  constructor(private ventasService: VentasService) {}

  ngOnInit(): void {
    this.getVentas();
  }

  getVentas(): void {
    this.ventasService.getVentas().subscribe(ventas => {
      this.ventas = ventas;
      this.ventasPendientesEnCamino = this.ventas.filter(venta => venta.estado !== 'entregado');
      this.ventasEntregadas = this.ventas.filter(venta => venta.estado === 'entregado');
      this.filtrarVentas();
    });
  }

  actualizarEstado(venta: Venta): void {
    if (venta.nuevoEstado) {
      this.ventasService.actualizarEstado(venta.idVenta, venta.nuevoEstado).subscribe(() => {
        this.getVentas();
      });
    } else {
      console.error('nuevoEstado no está definido en la venta:', venta);
    }
  }

  getEstadosPermitidos(estadoActual: string): string[] {
    switch (estadoActual) {
      case 'pendiente':
        return ['enviado'];
      case 'enviado':
        return ['entregado'];
      case 'entregado':
        return ['entregado'];
      default:
        return [];
    }
  }

  filtrarVentas(): void {
    const termino = this.terminoBusqueda.toLowerCase();
    this.ventasPendientesEnCaminoFiltradas = this.ventasPendientesEnCamino.filter(venta => {
      return venta.dni.toLowerCase().includes(termino);
    });
  }
}
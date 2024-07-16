import { Component, OnInit } from '@angular/core';
import { Venta } from '../../../models/venta.model';
import { VentasService } from '../ventas.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DetalleVenta } from '../../../models/detalle-venta.model';

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
  detalles: { [key: number]: DetalleVenta[] } = {};
  mostrarDetalles: { [key: number]: boolean } = {};

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
        this.enviarEmailActualizacionEstado(venta);
      });
    } else {
      console.error('nuevoEstado no está definido en la venta:', venta);
    }
  }

  enviarEmailActualizacionEstado(venta: Venta): void {
    this.ventasService.getUsuarioPorDni(venta.dni).subscribe((usuario: any) => {
      const emailRequest = {
        email: usuario.correo,
        nombres: usuario.nombres,
        apellidos: usuario.apellidos,
        nuevoEstado: venta.nuevoEstado
      };

      this.ventasService.enviarEmailActualizacionEstado(emailRequest).subscribe(() => {
        console.log('Email de actualización de estado enviado');
      }, error => {
        console.error('Error al enviar el correo electrónico:', error);
      });
    }, error => {
      console.error('Error al obtener los detalles del usuario:', error);
    });
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

  obtenerDetallesDeVenta(idVenta: number): void {
    if (!this.detalles[idVenta]) {
      this.ventasService.getDetallesDeVenta(idVenta).subscribe((detalles: DetalleVenta[]) => {
        this.detalles[idVenta] = detalles;
      });
    }
    this.mostrarDetalles[idVenta] = !this.mostrarDetalles[idVenta];
  }
}
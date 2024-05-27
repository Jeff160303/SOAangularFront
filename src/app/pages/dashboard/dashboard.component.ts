import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { Producto } from '../../models/producto.model';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {
  productosMostrados: Producto[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.http.get<Producto[]>('http://localhost:8080/productos/listar').subscribe(data => {
      this.productosMostrados = data.slice(0, 6);
      this.actualizarURLImagenes();
    });
  }

  actualizarURLImagenes(): void {
    this.productosMostrados.forEach(producto => {
      if (producto.detalleProducto && producto.detalleProducto.imagenProducto) {
        producto.detalleProducto.imagenProducto = `http://localhost:8080/imagenes/${producto.detalleProducto.imagenProducto}`;
      }
    });
  }
}
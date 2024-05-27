import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Producto } from '../../models/producto.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-listarproductos',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './listarproductos.component.html',
  styleUrls: ['./listarproductos.component.css']
})
export class ListarproductosComponent implements OnInit {

  productos: Producto[] = [];
  productosFiltrados: Producto[] = [];
  filtroActivo: string | null = null;

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.http.get<Producto[]>('http://localhost:8080/productos/listar').subscribe(data => {
      this.productos = data;
      this.productosFiltrados = [...this.productos];
      this.actualizarURLImagenes();
    });
  }

  actualizarURLImagenes(): void {
    this.productosFiltrados.forEach(producto => {
      if (producto.detalleProducto && producto.detalleProducto.imagenProducto) {
        producto.detalleProducto.imagenProducto = `http://localhost:8080/imagenes/${producto.detalleProducto.imagenProducto}`;
      }
    });
  }

  filtrarPorGenero(genero: string): void {
    if (genero === 'Hombre' || genero === 'Mujer') {
      this.productosFiltrados = this.productos.filter(producto => producto.catProducto === genero);
      this.filtroActivo = genero;
    }
  }

  resetearFiltro(): void {
    this.productosFiltrados = [...this.productos];
    this.filtroActivo = null;
  }

}

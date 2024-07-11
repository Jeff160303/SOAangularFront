import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { Producto } from '../../../models/producto.model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-editarproductos',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './editarproductos.component.html',
  styleUrl: './editarproductos.component.css'
})
export class EditarproductosComponent implements OnInit {

  productos: Producto[] = [];

  constructor(private http: HttpClient, private router: Router) { }

  ngOnInit(): void {
    this.cargarProductos();
  }

  cargarProductos(): void {
    this.http.get<any[]>('http://localhost:8080/productos/listarproducto').subscribe(
      (data) => {
        this.productos = data;
        this.actualizarURLImagenes();
      },
      error => {
        this.router.navigateByUrl('/desconectado');
      }
    );
  }

  actualizarURLImagenes(): void {
    this.productos.forEach(producto => {
      if (producto.imagenProducto) {
        producto.imagenProducto = `http://localhost:8080/imagenes/${producto.imagenProducto}`;
      }
    });
  }

  detalleProducto(idProducto: number): void {
    this.router.navigate(['/detalleProducto', idProducto]);
  }

  editarProducto(idProducto: number): void {
    this.router.navigate(['/formularioeditar', idProducto]);
  }

  eliminarProducto(id: number): void {
    const confirmacion = window.confirm('¿Estás seguro de que deseas eliminar este producto?');
    if (confirmacion) {
      console.log('Eliminando producto con ID:', id);
      this.http.delete(`http://localhost:8080/productos/eliminarProducto/${id}`).subscribe({
        next: () => {
          console.log('Producto eliminado');
          Swal.fire({
            title: 'Correcto',
            text: 'Producto Eliminado',
            icon: 'success',
          });
          this.cargarProductos();
        },
        error: (err) => {
          console.error('Error al eliminar el producto:', err);
          Swal.fire({
            title: 'Error',
            text: 'No se pudo eliminar el Producto',
            icon: 'error',
          });
        }
      });
    } else {
      console.log('Eliminación cancelada');
    }
  }

}
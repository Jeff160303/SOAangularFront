import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-eliminarproductos',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './eliminarproductos.component.html',
  styleUrl: './eliminarproductos.component.css'
})
export class EliminarproductosComponent implements OnInit {

  productos: any[] = [];

  constructor(private http: HttpClient, private router: Router) { }

  ngOnInit(): void {
    this.cargarProductos();
  }

  cargarProductos(): void {
    this.http.get<any[]>('http://localhost:8080/productos/listarproducto').subscribe(
      (data) => {
        this.productos = data;
      },
      error => {
        this.router.navigateByUrl('/desconectado');
      }
    );
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
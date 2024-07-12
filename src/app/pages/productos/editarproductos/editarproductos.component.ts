import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { Producto } from '../../../models/producto.model';
import Swal from 'sweetalert2';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-editarproductos',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './editarproductos.component.html',
  styleUrl: './editarproductos.component.css'
})
export class EditarproductosComponent implements OnInit {

  productos: Producto[] = [];
  productosFiltrados: Producto[] = [];
  searchTerm: string = '';

  constructor(private http: HttpClient, private router: Router) { }

  ngOnInit(): void {
    this.cargarProductos();
  }

  cargarProductos(): void {
    this.http.get<any[]>('http://localhost:8080/productos/listarproducto').subscribe(
      (data) => {
        this.productos = data;
        this.productosFiltrados = data;
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

  editarProducto(idProducto: number): void {
    this.router.navigate(['/formularioeditar', idProducto]);
  }

  eliminarProducto(id: number): void {
    Swal.fire({
      title: '¿Estás seguro?',
      text: "No podrás revertir esto",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        console.log('Eliminando producto con ID:', id);
        this.http.delete(`http://localhost:8080/productos/eliminarProducto/${id}`).subscribe({
          next: () => {
            console.log('Producto eliminado');
            Swal.fire({
              title: 'Eliminado',
              text: 'Producto eliminado con éxito',
              icon: 'success',
            });
            this.cargarProductos();
          },
          error: (err) => {
            console.error('Error al eliminar el producto:', err);
            Swal.fire({
              title: 'Error',
              text: 'No se pudo eliminar el producto',
              icon: 'error',
            });
          }
        });
      } else {
        console.log('Eliminación cancelada');
      }
    });
  }
  

  buscarProducto(): void {
    if (this.searchTerm === '') {
      this.productosFiltrados = this.productos;
    } else {
      this.productosFiltrados = this.productos.filter(producto =>
        producto.nombreProducto.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }
  }

}
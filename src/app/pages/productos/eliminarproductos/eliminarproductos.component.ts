import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';

@Component({
  selector: 'app-eliminarproductos',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './eliminarproductos.component.html',
  styleUrl: './eliminarproductos.component.css'
})
export class EliminarproductosComponent {

  productos: any[] = [];

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.cargarProductos();
  }

  cargarProductos(): void {
    this.http.get<any[]>('http://localhost:8080/productos/listarproducto').subscribe(
      (data) => {
        this.productos = data;
        this.productos.forEach(producto => {
          this.http.get<any[]>(`http://localhost:8080/productos/listarDetalleProductoPorIdProducto/${producto.idproducto}`).subscribe(
            (detalles) => {
              producto.detalles = detalles;
            },
            (error) => {
              console.error('Error al obtener detalles del producto:', error);
            }
          );
        });
      },
      (error) => {
        console.error('Error al obtener la lista de productos:', error);
      }
    );
  }

  eliminarProducto(id: number): void {
    const confirmacion = window.confirm('¿Estás seguro de que deseas eliminar este producto?');
    if (confirmacion) {
        console.log('Eliminando producto con ID:', id);
        this.http.delete(`http://localhost:8080/productos/eliminarProductoyDetalle/${id}`)
            .subscribe({
                next: () => {
                    console.log('Producto eliminado');
                    this.cargarProductos(); // Recargar la lista de productos
                },
                error: (err) => {
                    console.error('Error al eliminar el producto:', err);
                }
            });
    } else {
        console.log('Eliminación cancelada');
    }
  } 
}

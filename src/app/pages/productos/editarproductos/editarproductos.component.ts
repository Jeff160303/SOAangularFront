import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router'; // Importa RouterModule aquí

@Component({
  selector: 'app-editarproductos',
  standalone: true,
  imports: [CommonModule, RouterModule], // Agrega RouterModule aquí
  templateUrl: './editarproductos.component.html',
  styleUrl: './editarproductos.component.css'
})
export class EditarproductosComponent implements OnInit {

  productos: any[] = [];

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    // Llamar al endpoint para obtener la lista de productos
    this.http.get<any[]>('http://localhost:8080/productos/listarproducto').subscribe(
      (data) => {
        this.productos = data;
        // Por cada producto, llamar al endpoint para obtener los detalles
        this.productos.forEach(producto => {
          this.http.get<any[]>(`http://localhost:8080/productos/listarDetalleProductoPorIdProducto/${producto.idproducto}`).subscribe(
            (detalles) => {
              // Asegurarse de que el objeto producto tenga una propiedad detalles
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


  eliminarProducto(id: number) {
    // Implementar lógica para eliminar el producto con el id proporcionado
  }

}

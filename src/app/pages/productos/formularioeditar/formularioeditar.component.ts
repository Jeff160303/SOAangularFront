import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-formularioeditar',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './formularioeditar.component.html',
  styleUrl: './formularioeditar.component.css'
})
export class FormularioeditarComponent implements OnInit {

  producto: any = {};
  detalles: any[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient
  ) { }

  ngOnInit(): void {
    const idProducto = this.route.snapshot.params['id'];

    // Obtener los datos del producto y sus detalles
    this.http.get<any>(`http://localhost:8080/productos/listarProductoPorId/${idProducto}`).subscribe(
  (producto) => {
    console.log('Datos del producto recibidos:', producto);
    this.producto = producto;
  },
  (error) => {
    console.error('Error al obtener detalles del producto:', error);
  }
);

this.http.get<any[]>(`http://localhost:8080/productos/listarDetalleProductoPorIdProducto/${idProducto}`).subscribe(
  (detalles) => {
    console.log('Detalles del producto recibidos:', detalles);
    this.detalles = detalles;
  },
  (error) => {
    console.error('Error al obtener detalles del producto:', error);
  }
);

  }

  editar() {
    // Lógica para editar el producto y sus detalles
    const idProducto = this.route.snapshot.params['id']; // Obtener ID del producto desde la URL
  
    this.http.put(`http://localhost:8080/productos/actualizarProducto/${idProducto}`, this.producto).subscribe(
      (response) => {
        console.log('Producto actualizado exitosamente:', response);
        // Redirigir al componente anterior
        this.router.navigate(['/editarproductos']);
      },
      (error) => {
        console.error('Error al actualizar el producto:', error);
      }
    );
  
    this.http.put(`http://localhost:8080/productos/actualizarDetalles/${idProducto}`, this.detalles).subscribe(
      (response) => {
        console.log('Detalles del producto actualizados exitosamente:', response);
        // Redirigir al componente anterior
        this.router.navigate(['/editarproductos']);
      },
      (error) => {
        console.error('Error al actualizar los detalles del producto:', error);
      }
    );
  }
  
  

  cancelar() {
    this.router.navigate(['/editarproductos']);
  }
}
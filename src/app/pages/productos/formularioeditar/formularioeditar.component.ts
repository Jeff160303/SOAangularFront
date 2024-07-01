import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-formularioeditar',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './formularioeditar.component.html',
  styleUrl: './formularioeditar.component.css'
})
export class FormularioeditarComponent implements OnInit {

  producto: any = {};
  idProducto: number;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient
  ) {
    this.idProducto = 0;
  }

  ngOnInit(): void {
    this.idProducto = +this.route.snapshot.params['id'];

    this.http.get<any>(`http://localhost:8080/productos/listarProductoPorId/${this.idProducto}`).subscribe(
      (producto) => {
        console.log('Datos del producto recibidos:', producto);
        this.producto = producto;
      },
      (error) => {
        console.error('Error al obtener detalles del producto:', error);
      }
    );
  }

  editar(): void {
    this.http.put(`http://localhost:8080/productos/actualizarProducto/${this.idProducto}`, this.producto).subscribe(
      (response) => {
        console.log('Producto actualizado exitosamente:', response);
        Swal.fire({
          title: 'Correcto',
          text: 'Producto Actualizado',
          icon: 'success',
        });
        this.router.navigate(['/editarproductos']);
      },
      (error) => {
        console.error('Error al actualizar el producto:', error);
        Swal.fire({
          title: 'Error',
          text: 'No se pudo actualizar el Producto',
          icon: 'error',
        });
      }
    );
  }

  cancelar(): void {
    this.router.navigate(['/editarproductos']);
  }
}
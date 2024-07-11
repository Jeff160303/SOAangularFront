import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Producto } from '../../../models/producto.model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-crearproductos',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './crearproductos.component.html',
  styleUrls: ['./crearproductos.component.css']
})
export class CrearproductosComponent {

  nuevoProducto: Producto = {
    idProducto: 0,
    nombreProducto: '',
    catProducto: '',
    precioProducto: 0,
    tallaS: 0,
    tallaM: 0,
    tallaL: 0,
    imagenProducto: ''
  };

  selectedFile: File | null = null;

  constructor(private http: HttpClient) {}

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }

  guardarProducto() {
    if (!this.selectedFile) {
      console.error('Debe seleccionar un archivo de imagen.');
      return;
    }

    if (!this.nuevoProducto.tallaS) {
      this.nuevoProducto.tallaS = 0;
    }
    if (!this.nuevoProducto.tallaM) {
      this.nuevoProducto.tallaM = 0;
    }
    if (!this.nuevoProducto.tallaL) {
      this.nuevoProducto.tallaL = 0;
    }
    if (!this.nuevoProducto.precioProducto) {
      this.nuevoProducto.precioProducto = 0;
    }

    const formData = new FormData();
    formData.append('producto', JSON.stringify(this.nuevoProducto));
    formData.append('file', this.selectedFile);

    this.http.post<number>('http://localhost:8080/productos/crear', formData).subscribe(
      idProducto => {
        console.log(`Producto creado con ID: ${idProducto}`);
        this.nuevoProducto = {
          idProducto: 0,
          nombreProducto: '',
          catProducto: '',
          precioProducto: 0,
          tallaS: 0,
          tallaM: 0,
          tallaL: 0,
          imagenProducto: ''
        };
        Swal.fire({
          title: 'Correcto',
          text: 'Producto Creado correctamente',
          icon: 'success',
        });
        this.selectedFile = null;
      },
      error => {
        console.error('Error al crear el producto:', error);
        Swal.fire({
          title: 'Error',
          text: 'Ocurrio un problema para crear el producto',
          icon: 'warning',
        });
      }
    );
  }
}
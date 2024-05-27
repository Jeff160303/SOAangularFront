import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-crearproductos',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './crearproductos.component.html',
  styleUrls: ['./crearproductos.component.css']
})
export class CrearproductosComponent {
  nuevoProducto: any = {
    nombreProducto: '',
    catProducto: '',
    precioProducto: '',
    detalleProducto: {
      s: false,
      m: false,
      l: false,
      stock_s: 0,
      stock_m: 0,
      stock_l: 0,
      imagenProducto: ''
    },
    detalles: []
  };

  selectedFile: File | null = null;

  constructor(private http: HttpClient) {}

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
    this.nuevoProducto.detalleProducto.imagenProducto = this.selectedFile ? this.selectedFile.name : '';
  }

  guardarProducto() {
    const formData = new FormData();
    if (this.selectedFile) {
      formData.append('file', this.selectedFile);
      this.http.post<{ imageName: string }>('http://localhost:8080/productos/upload', formData)
        .subscribe(response => {
          // Solo enviar el nombre del archivo sin la ruta completa
          this.nuevoProducto.detalleProducto.imagenProducto = response.imageName.split('/').pop();

          // Añadir detalles para cada talla seleccionada
          if (this.nuevoProducto.detalleProducto.s) {
            this.nuevoProducto.detalles.push({ tallas: 'S', stock: this.nuevoProducto.detalleProducto.stock_s, imagenProducto: response.imageName });
          }
          if (this.nuevoProducto.detalleProducto.m) {
            this.nuevoProducto.detalles.push({ tallas: 'M', stock: this.nuevoProducto.detalleProducto.stock_m, imagenProducto: response.imageName });
          }
          if (this.nuevoProducto.detalleProducto.l) {
            this.nuevoProducto.detalles.push({ tallas: 'L', stock: this.nuevoProducto.detalleProducto.stock_l, imagenProducto: response.imageName });
          }

          this.http.post('http://localhost:8080/productos/crear', this.nuevoProducto)
            .subscribe(
              response => {
                console.log('Producto creado:', response);
                // Reiniciar el formulario después de la creación
                this.nuevoProducto = {
                  nombreProducto: '',
                  catProducto: '',
                  precioProducto: '',
                  detalleProducto: {
                    s: false,
                    m: false,
                    l: false,
                    stock_s: 0,
                    stock_m: 0,
                    stock_l: 0,
                    imagenProducto: ''
                  },
                  detalles: []
                };
                this.selectedFile = null;
              },
              error => {
                console.error('Error al crear el producto:', error);
              }
            );
        });
    } else {
      console.error('Debe seleccionar un archivo de imagen.');
    }
  }
}
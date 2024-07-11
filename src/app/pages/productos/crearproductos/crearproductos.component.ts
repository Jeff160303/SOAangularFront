import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup, FormsModule, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-crearproductos',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './crearproductos.component.html',
  styleUrls: ['./crearproductos.component.css']
})
export class CrearproductosComponent {

  productoForm: FormGroup;
  selectedFile: File | null = null;

  constructor(private fb: FormBuilder, private http: HttpClient) {
    this.productoForm = this.fb.group({
      nombreProducto: ['', Validators.required],
      catProducto: ['', Validators.required],
      precioProducto: ['', Validators.required],
      tallaS: [0],
      tallaM: [0],
      tallaL: [0],
      imagenProducto: ['', Validators.required]
    });
  }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
    this.productoForm.patchValue({ imagenProducto: this.selectedFile });
  }

  atLeastOneSize(): boolean {
    const tallaS = this.productoForm.get('tallaS')?.value || 0;
    const tallaM = this.productoForm.get('tallaM')?.value || 0;
    const tallaL = this.productoForm.get('tallaL')?.value || 0;
    return tallaS > 0 || tallaM > 0 || tallaL > 0;
  }

  guardarProducto() {
    if (!this.productoForm.valid || !this.selectedFile || !this.atLeastOneSize()) {
      Swal.fire({
        title: 'Error',
        text: 'Por favor, complete todos los campos requeridos',
        icon: 'warning'
      });
      return;
    }

    const formData = new FormData();
    formData.append('producto', JSON.stringify(this.productoForm.value));
    formData.append('file', this.selectedFile);

    this.http.post<number>('http://localhost:8080/productos/crear', formData).subscribe(
      idProducto => {
        console.log(`Producto creado con ID: ${idProducto}`);
        this.productoForm.reset({
          nombreProducto: '',
          catProducto: '',
          precioProducto: 0,
          tallaS: 0,
          tallaM: 0,
          tallaL: 0,
          imagenProducto: ''
        });
        Swal.fire({
          title: 'Correcto',
          text: 'Producto Creado correctamente',
          icon: 'success'
        });
        this.selectedFile = null;
      },
      error => {
        console.error('Error al crear el producto:', error);
        Swal.fire({
          title: 'Error',
          text: 'Ocurrió un problema para crear el producto',
          icon: 'warning'
        });
      }
    );
  }
}
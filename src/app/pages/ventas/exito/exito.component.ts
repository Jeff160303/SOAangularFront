import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-exito',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './exito.component.html',
  styleUrl: './exito.component.css'
})
export class ExitoComponent{

  constructor(private http: HttpClient, private router: Router) { }

  ngOnInit(): void {
    this.handleSuccessfulPayment();
  }

  handleSuccessfulPayment(): void {
    console.log('Handling successful payment...');

    Swal.fire({
      title: 'Procesando compra...',
      text: 'Por favor espera un momento.',
      icon: 'info',
      allowOutsideClick: false,
      showConfirmButton: false
    });

    const userData = JSON.parse(localStorage.getItem('userData') || '{}');
    const carritos = JSON.parse(localStorage.getItem('carritos') || '[]');

    if (userData && carritos.length > 0) {
      const venta = {
        fechaEmision: new Date(),
        dni: userData.dni,
        nombres: userData.nombres,
        apellidos: userData.apellidos,
        tipoVenta: 'pedido',
        direccion: 'Dirección del usuario',
        total: this.calcularTotalAmount(carritos),
        estado: 'pendiente'
      };

      const detalles = carritos.map((carrito: any) => ({
        nombreProducto: carrito.nombreProducto,
        cantProducto: carrito.cantidadProducto,
        tallaProducto: carrito.talla,
        precioProducto: carrito.precioProducto
      }));

      const payload = {
        email: userData.correo,
        venta: venta,
        detalles: detalles
      };

      console.log('Sending payload to backend:', payload);

      this.http.post('http://localhost:8060/email/boleta', payload)
        .subscribe(
          response => {
            console.log('Respuesta del servidor:', response);
            Swal.fire({
              title: 'Compra exitosa',
              text: 'La boleta ha sido enviada por correo.',
              icon: 'success'
            }).then(() => {
              // Redireccionar o realizar otras acciones
            });
          },
          error => {
            console.error('Error al enviar la boleta:', error);
            Swal.fire({
              title: 'Error',
              text: 'Ocurrió un error al enviar la boleta.',
              icon: 'error'
            });
          }
        );
    } else {
      Swal.fire({
        title: 'Error',
        text: 'No se encontraron productos en el carrito o no se encontraron datos de usuario.',
        icon: 'error'
      });
    }
  }

  calcularTotalAmount(carritos: any[]): number {
    return carritos.reduce((total, carrito) => total + (carrito.cantidadProducto * carrito.precioProducto), 0);
  }

  inicio(){
    this.router.navigateByUrl('/');
  }

}

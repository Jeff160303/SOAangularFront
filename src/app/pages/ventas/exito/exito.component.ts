import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-exito',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './exito.component.html',
  styleUrl: './exito.component.css'
})
export class ExitoComponent implements OnInit {

  cargando: boolean = false;
  userData: any;
  carritos: any[] = [];

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

    this.userData = JSON.parse(localStorage.getItem('userData') || '{}');
    this.carritos = JSON.parse(localStorage.getItem('carritos') || '[]');
    const direccionSeleccionada = localStorage.getItem('direccionSeleccionada') || 'Recojo en Tienda';
    console.log('Direccion seleccionada:', direccionSeleccionada);

    if (this.userData && this.carritos.length > 0) {
      const venta = {
        fechaEmision: new Date(),
        dni: this.userData.dni,
        nombres: this.userData.nombres,
        apellidos: this.userData.apellidos,
        tipoVenta: 'pedido',
        direccion: direccionSeleccionada,
        total: this.calcularTotalAmount(this.carritos),
        estado: 'pendiente'
      };

      const detalles = this.carritos.map((carrito: any) => ({
        nombreProducto: carrito.nombreProducto,
        cantProducto: carrito.cantidadProducto,
        tallaProducto: carrito.talla,
        precioProducto: carrito.precioProducto
      }));

      const payload = {
        email: this.userData.correo,
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
              this.actualizarCantidades(this.carritos);
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

  actualizarCantidades(carritos: any[]): void {
    const actualizaciones = carritos.map((carrito: any) => ({
      idProducto: carrito.idProducto,
      talla: carrito.talla,
      cantidad: carrito.cantidadProducto
    }));

    this.http.put('http://localhost:8080/productos/actualizarCantidades', actualizaciones)
      .subscribe(
        response => {
          console.log('Cantidades actualizadas exitosamente:', response);
          this.vaciarCarrito(carritos);
        },
        error => {
          console.error('Error al actualizar cantidades:', error);
          Swal.fire({
            title: 'Error',
            text: 'Ocurrió un error al actualizar las cantidades de los productos.',
            icon: 'error'
          });
        }
      );
  }

  vaciarCarrito(carritos: any[]): void {
    const eliminarProductoPromises = carritos.map((carrito: any) => this.eliminarProducto(carrito.idCarrito));
    Promise.all(eliminarProductoPromises)
      .then(() => {
        console.log('Carrito vaciado exitosamente.');
        this.router.navigate(['/']);
      })
      .catch(error => {
        console.error('Error al vaciar el carrito:', error);
        Swal.fire({
          title: 'Error',
          text: 'Ocurrió un error al vaciar el carrito.',
          icon: 'error'
        });
      });
  }

  eliminarProducto(idCarrito: number): Promise<void> {
    return new Promise((resolve, reject) => {
      this.cargando = true;
      this.http.delete(`http://localhost:8070/carrito/eliminar/${idCarrito}`).subscribe(
        response => {
          console.log('Producto eliminado del carrito:', response);
          setTimeout(() => {
            this.cargando = false;
            resolve();
          }, 300);
        },
        error => {
          console.error('Error al eliminar producto del carrito:', error);
          setTimeout(() => {
            this.cargando = false;
            reject(error);
          }, 300);
        }
      );
    });
  }

  calcularTotalAmount(carritos: any[]): number {
    return carritos.reduce((total, carrito) => total + (carrito.cantidadProducto * carrito.precioProducto), 0);
  }

  inicio(): void {
    this.router.navigateByUrl('/');
  }

}
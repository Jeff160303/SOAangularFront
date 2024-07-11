import { Component, OnInit } from '@angular/core';
import { AuthService, UserData } from '../../auth.service';
import { HttpClient } from '@angular/common/http';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Producto } from '../../models/producto.model';
import { CarritoService } from '../../carrito.service';
import Swal from 'sweetalert2';
import { PaymentService } from '../ventas/payment.service';

declare var Stripe: any; 

@Component({
  selector: 'app-carrito',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './carrito.component.html',
  styleUrls: ['./carrito.component.css']
})
export class CarritoComponent implements OnInit {
  userData: UserData | null = null;
  carritos: any[] = [];
  totalAmount: number = 0;
  cargando: boolean = false;

  constructor(private http: HttpClient, private router: Router, private authService: AuthService, private carritoService: CarritoService,private paymentService: PaymentService) {}

  ngOnInit(): void {
    this.authService.userData$.subscribe(userData => {
      this.userData = userData;
      if (this.userData) {
        this.cargarCarrito(this.userData.dni);
      }
    });
  }

  cargarCarrito(dni: string): void {
    this.http.get<any[]>(`http://localhost:8070/carrito/listar/${dni}`).subscribe(data => {
      this.carritos = data;
      this.carritoService.actualizarCantidadProductosEnCarrito(this.carritos.length);
      this.carritos.forEach(carrito => {
        this.cargarDetallesProducto(carrito);
      });
    },
    error => {
      this.router.navigateByUrl('/desconectado');
    }
  );
  }

  cargarDetallesProducto(carrito: any): void {
    this.http.get<Producto>(`http://localhost:8080/productos/listarProductoPorId/${carrito.idProducto}`).subscribe(detalle => {
      carrito.nombreProducto = detalle.nombreProducto;
      carrito.catProducto = detalle.catProducto;
      carrito.precioProducto = detalle.precioProducto;
      carrito.imagenProducto = `http://localhost:8080/imagenes/${detalle.imagenProducto}`;
      carrito.detalle = detalle;
    },
    error => {
      this.router.navigateByUrl('/desconectado');
    });
  }
  

  obtenerTallasDisponibles(carrito: any): string[] {
    const tallas = ['S', 'M', 'L'];
    if (carrito.detalle) {
      return tallas.filter(talla => carrito.detalle[`talla${talla}`] > 0);
    }
    return [];
  }  

  actualizarCarrito(carrito: any): void {
    this.cargando = true;
    this.http.put(`http://localhost:8070/carrito/actualizar/${carrito.idCarrito}`, {
      talla: carrito.talla,
      cantidadProducto: carrito.cantidadProducto
    }).subscribe(
      response => {
        console.log('Carrito actualizado:', response);
        setTimeout(() => {
          this.cargando = false;
        }, 300);
      },
      error => {
        console.error('Error al actualizar el carrito:', error);
        setTimeout(() => {
          this.cargando = false;
        }, 300);
        alert('Error, los cambios no se pudieron guardar');
      }
    );
  }

  eliminarProducto(idCarrito: number): void {
    this.cargando = true;
    this.http.delete(`http://localhost:8070/carrito/eliminar/${idCarrito}`).subscribe(
      response => {
        console.log('Producto eliminado del carrito:', response);
        this.cargarCarrito(this.userData?.dni || '');
        setTimeout(() => {
          this.cargando = false;
        }, 300);
      },
      error => {
        console.error('Error al eliminar producto del carrito:', error);
        setTimeout(() => {
          this.cargando = false;
        }, 300);
      }
    );
  }

  calcularSubtotal(): string {
    const total = this.calcularTotal();
    const igv = total * 0.18;
    const subtotal = total - igv;
    return subtotal.toFixed(2);
  }

  calcularIGV(): string {
    const total = this.calcularTotal();
    const igv = total * 0.18;
    return igv.toFixed(2);
  }

  calcularTotal(): number {
    const total = this.carritos.reduce((acc, carrito) => acc + (carrito.precioProducto * carrito.cantidadProducto), 0);
    return total;
  }

  private calcularTotalAmount(): number {
    return this.calcularTotal();
  }

  makePayment(): void {
    const amount = this.calcularTotal() * 100;
  
    localStorage.setItem('userData', JSON.stringify(this.userData));
    localStorage.setItem('carritos', JSON.stringify(this.carritos));
  
    this.paymentService.createCheckoutSession(amount)
      .then((response: any) => {
        const sessionId = response.id;
        const stripe = Stripe('pk_test_51Pb0tI2N50f3xlN2Yu218bz88PY5B8tZsAigCXQEqCdWisHn6vTzzT3stqW6rzumfmIVRZkSgKAmCGitMbwQEy0K00ILTTXvqV');
        stripe.redirectToCheckout({ sessionId: sessionId });
      })
      .catch((error: any) => console.error(error));
  }
  
  
  
}
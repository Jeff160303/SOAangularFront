import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService, UserData } from '../../auth.service';
import { CarritoService } from '../../carrito.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-detalle-producto',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './detalle-producto.component.html',
  styleUrl: './detalle-producto.component.css'
})
export class DetalleProductoComponent implements OnInit {

  producto: any = {};
  idProducto: number;
  userData: UserData | null = null;
  carritos: any[] = [];
  quantity: number = 1;
  tallaSeleccionada: string = '';

  constructor(private route: ActivatedRoute, private router: Router, private http: HttpClient, private authService: AuthService, private carritoService: CarritoService) {
    this.idProducto = 0;
  }

  ngOnInit(): void {
    this.idProducto = +this.route.snapshot.params['id'];
    
    this.authService.userData$.subscribe(userData => {
      this.userData = userData;
      if (this.userData) {
        this.cargarCarrito(this.userData.dni);
      }
    });

    this.http.get<any>(`http://localhost:8080/productos/listarProductoPorId/${this.idProducto}`).subscribe(
      (producto) => {
        console.log('Datos del producto recibidos:', producto);
        this.producto = producto;
        this.actualizarURLImagenes();
      },
      (error) => {
        console.error('Error al obtener detalles del producto:', error);
      }
    );
  }

  actualizarURLImagenes(): void {
    this.producto.imagenProducto = `http://localhost:8080/imagenes/${this.producto.imagenProducto}`;
  }

  selectSize(talla: string) {
    this.tallaSeleccionada = talla;
  }

  addToCart() {
    if (this.userData) {
      if (this.tallaSeleccionada && this.quantity > 0) {
        const carritoExistente = this.carritos.find(carrito => carrito.idProducto === this.idProducto && carrito.talla === this.tallaSeleccionada);

        if (carritoExistente) {
          carritoExistente.cantidadProducto += this.quantity;
          this.actualizarCarrito(carritoExistente);
        } else {
          const carrito = {
            idProducto: this.idProducto,
            dni: this.userData.dni,
            talla: this.tallaSeleccionada,
            cantidadProducto: this.quantity
          };

          this.http.post('http://localhost:8070/carrito/crear', carrito).subscribe(
            (response) => {
              console.log('Producto agregado al carrito:', response);
              Swal.fire({
                title: 'Agregado',
                text: 'Producto agregado al carrito',
                icon: 'success',
              });
              this.actualizarCantidadProductosEnCarrito();
              // Recargar el carrito después de agregar un nuevo producto
              this.cargarCarrito(this.userData?.dni || '');
            },
            (error) => {
              console.error('Error al agregar al carrito:', error);
              Swal.fire({
                title: 'Error!',
                text: 'Error de servidor. Por favor, intenta nuevamente más tarde.',
                icon: 'error',
              });
            }
          );
        }
      } else {
        alert('Por favor, selecciona una talla y una cantidad válida.');
      }
    } else {
      alert('Es necesario iniciar sesión para usar esta función.');
    }
  }

  isTallaAvailable(talla: string): boolean {
    return this.producto[`talla${talla}`] > 0;
  }

  private cargarCarrito(dni: string): void {
    this.http.get<any[]>(`http://localhost:8070/carrito/listar/${dni}`).subscribe(data => {
      this.carritos = data;
    },
    error => {
      this.router.navigateByUrl('/desconectado');
    });
  }

  private actualizarCantidadProductosEnCarrito(): void {
    if (this.userData) {
      this.http.get<any[]>(`http://localhost:8070/carrito/listar/${this.userData.dni}`).subscribe(data => {
        this.carritoService.actualizarCantidadProductosEnCarrito(data.length);
      });
    }
  }

  private actualizarCarrito(carrito: any): void {
    this.http.put(`http://localhost:8070/carrito/actualizar/${carrito.idCarrito}`, {
      talla: carrito.talla,
      cantidadProducto: carrito.cantidadProducto
    }).subscribe(
      response => {
        console.log('Carrito actualizado:', response);
        Swal.fire({
          title: 'Actualizado',
          text: 'El carrito ha sido actualizado',
          icon: 'success',
        });
      },
      error => {
        console.error('Error al actualizar el carrito:', error);
        Swal.fire({
          title: 'Error',
          text: 'El carrito no pudo ser actualizado',
          icon: 'error',
        });
      }
    );
  }
}
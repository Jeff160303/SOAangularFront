import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Producto } from '../../models/producto.model';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService, UserData } from '../../auth.service';
import { CarritoService } from '../../carrito.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-listarproductos',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './listarproductos.component.html',
  styleUrls: ['./listarproductos.component.css']
})
export class ListarproductosComponent implements OnInit {

  productos: Producto[] = [];
  productosFiltrados: Producto[] = [];
  filtroActivo: string | null = null;
  userData: UserData | null = null;
  carritos: any[] = [];

  constructor(private http: HttpClient, private router: Router, private authService: AuthService, private carritoService: CarritoService) { }

  ngOnInit(): void {
    this.http.get<Producto[]>('http://localhost:8080/productos/listarproducto').subscribe(data => {
      this.productos = data;
      this.productosFiltrados = [...this.productos];
      this.actualizarURLImagenes();
    },
    error => {
      this.router.navigateByUrl('/desconectado');
    }
    );
    this.authService.userData$.subscribe(userData => {
      this.userData = userData;
      if (this.userData) {
        this.cargarCarrito(this.userData.dni);
      }
    });
  }

  actualizarURLImagenes(): void {
    this.productosFiltrados.forEach(producto => {
      if (producto.imagenProducto) {
        producto.imagenProducto = `http://localhost:8080/imagenes/${producto.imagenProducto}`;
      }
    });
  }

  filtrarPorGenero(genero: string): void {
    if (genero === 'Hombre' || genero === 'Mujer') {
      this.productosFiltrados = this.productos.filter(producto => producto.catProducto === genero);
      this.filtroActivo = genero;
    }
  }

  resetearFiltro(): void {
    this.productosFiltrados = [...this.productos];
    this.filtroActivo = null;
  }

  detalleProducto(idProducto: number): void {
    this.router.navigate(['/detalleProducto', idProducto]);
  }

  cargarCarrito(dni: string): void {
    this.http.get<any[]>(`http://localhost:8070/carrito/listar/${dni}`).subscribe(data => {
      this.carritos = data;
    },
    error => {
      this.router.navigateByUrl('/desconectado');
    });
  }

  agregarPrimeraTallaDisponible(producto: Producto): void {
    const tallas = ['S', 'M', 'L'];
    const tallaDisponible = tallas.find(talla => (producto as any)[`talla${talla}`] > 0);

    if (tallaDisponible && this.userData) {
      const carritoExistente = this.carritos.find(carrito => carrito.idProducto === producto.idProducto);

      if (carritoExistente) {
        carritoExistente.cantidadProducto += 1;
        carritoExistente.talla = tallaDisponible;
        this.actualizarCarrito(carritoExistente);
      } else {
        const carrito = {
          idProducto: producto.idProducto,
          dni: this.userData.dni,
          talla: tallaDisponible,
          cantidadProducto: 1
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
              title: 'Error',
              text: 'El producto no pudo ser agregado al carrito',
              icon: 'error',
            });
          }
        );
      }
    } else if (!this.userData) {
      alert('Es necesario iniciar sesión para usar esta función.');
    } else {
      alert('No hay tallas disponibles para este producto.');
    }
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

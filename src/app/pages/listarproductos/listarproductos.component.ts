import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Producto } from '../../models/producto.model';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService, UserData } from '../../auth.service';
import { CarritoService } from '../../carrito.service';

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

  constructor(private http: HttpClient, private router: Router, private authService: AuthService, private carritoService: CarritoService) { }

  ngOnInit(): void {
    this.http.get<Producto[]>('http://localhost:8080/productos/listarproducto').subscribe(data => {
      this.productos = data;
      this.productosFiltrados = [...this.productos];
      this.actualizarURLImagenes();
    });
    this.authService.userData$.subscribe(userData => {
      this.userData = userData;
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

  agregarPrimeraTallaDisponible(producto: Producto): void {
    const tallas = ['S', 'M', 'L'];
    const tallaDisponible = tallas.find(talla => (producto as any)[`talla${talla}`] > 0);

    if (tallaDisponible && this.userData) {
      const carrito = {
        idProducto: producto.idProducto,
        dni: this.userData.dni,
        talla: tallaDisponible,
        cantidadProducto: 1
      };

      this.http.post('http://localhost:8070/carrito/crear', carrito).subscribe(
        (response) => {
          console.log('Producto agregado al carrito:', response);
          alert('Producto agregado al carrito');
          this.actualizarCantidadProductosEnCarrito();
        },
        (error) => {
          console.error('Error al agregar al carrito:', error);
        }
      );
    } else if (!this.userData) {
      alert('Es necesario iniciar sesión para usar esta función.');
    } else {
      alert('No hay tallas disponibles para este producto.');
    }
  }

  private actualizarCantidadProductosEnCarrito(): void {
    if (this.userData) {
      this.http.get<any[]>(`http://localhost:8070/carrito/listar/${this.userData.dni}`).subscribe(data => {
        this.carritoService.actualizarCantidadProductosEnCarrito(data.length); // Actualiza la cantidad
      });
    }
  }
}

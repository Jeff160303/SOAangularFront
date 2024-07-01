import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService, UserData } from '../../auth.service';
import { CarritoService } from '../../carrito.service';

@Component({
  selector: 'app-detalle-producto',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './detalle-producto.component.html',
  styleUrl: './detalle-producto.component.css'
})
export class DetalleProductoComponent {

  producto: any = {};
  idProducto: number;
  userData: UserData | null = null;

  constructor(private route: ActivatedRoute, private router: Router, private http: HttpClient, private authService: AuthService, private carritoService: CarritoService) {
    this.idProducto = 0;
  }

  ngOnInit(): void {
    this.idProducto = +this.route.snapshot.params['id'];
    
    this.authService.userData$.subscribe(userData => {
      this.userData = userData;
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

  quantity: number = 1;
  tallaSeleccionada: string = '';

  selectSize(talla: string) {
    this.tallaSeleccionada = talla;
  }


  addToCart(){
    if (this.userData){
      if (this.tallaSeleccionada && this.quantity > 0) {
        const carrito = {
          idProducto: this.idProducto,
          dni: this.userData.dni,
          talla: this.tallaSeleccionada,
          cantidadProducto: this.quantity
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
      } else {
        alert('Por favor, selecciona una talla y una cantidad válida.');
      }
    } else {
      alert('Es necesario iniciar sesion para usar esta funcion');
    }
  }

  isTallaAvailable(talla: string): boolean {
    return this.producto[`talla${talla}`] > 0;
  }

  private actualizarCantidadProductosEnCarrito(): void {
    if (this.userData) {
      this.http.get<any[]>(`http://localhost:8070/carrito/listar/${this.userData.dni}`).subscribe(data => {
        this.carritoService.actualizarCantidadProductosEnCarrito(data.length);
      });
    }
  }
}

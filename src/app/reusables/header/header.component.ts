import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService, UserData } from '../../auth.service';
import { CarritoService } from '../../carrito.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  userData: UserData | null = null;
  cantidadProductosEnCarrito: number = 0;

  constructor(private router: Router, private authService: AuthService, private carritoService: CarritoService) {}

  ngOnInit() {
    this.authService.userData$.subscribe(userData => {
      this.userData = userData;
    });

    this.carritoService.cantidadProductosEnCarrito$.subscribe(cantidad => {
      this.cantidadProductosEnCarrito = cantidad;
    });
  }

  sesion() {
    if (this.authService.getUserRole() !== 'error') {
      this.authService.clearUser();
      this.router.navigateByUrl('/');
    } else {
      this.router.navigateByUrl('/login');
    }
  }

  registro(){
    this.router.navigateByUrl('/register');
  }

  delivery(){
    this.router.navigateByUrl('/delivery');
  }

  perfil(){
    this.router.navigateByUrl('/perfil');
  }

  inicio(){
    this.router.navigateByUrl('/');
  }

  productos() {
    this.router.navigateByUrl('/productos');
  }

  crearproductos() {
    this.router.navigateByUrl('/crearproductos');
  }

  editarproductos() {
    this.router.navigateByUrl('/editarproductos');
  }

  carrito(){
    this.router.navigateByUrl('/carrito')
  }

  deliveryGestion(){
    this.router.navigateByUrl('/deliveryGestion');
  }
}

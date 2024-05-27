import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {

  constructor(private router: Router) {

  }

  SingUp() {
    this.router.navigateByUrl('/login');
  }

  productos() {
    this.router.navigateByUrl('/productos');
  }

  crearproductos() {
    this.router.navigateByUrl('/crearproductos');
  }
  
  editarproductos(){
    this.router.navigateByUrl('/editarproductos');
  }

  eliminarproductos(){
    this.router.navigateByUrl('/eliminarproductos');
  }

}

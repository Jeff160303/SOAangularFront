import { Component } from '@angular/core';
import { Router, RouterOutlet} from '@angular/router';
import { AuthService, UserData } from '../../auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [RouterOutlet, CommonModule],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css'
})
export class FooterComponent {
  userData: UserData | null = null;

  constructor(private router: Router, private authService: AuthService) {

  }

  ngOnInit() {
    this.authService.userData$.subscribe(userData => {
      this.userData = userData;
    });
  }

  sesion() {
    this.router.navigateByUrl('/login');
  }

  registro(){
    this.router.navigateByUrl('/register');
  }

  carrito(){
    this.router.navigateByUrl('/carrito');
  }

  
}

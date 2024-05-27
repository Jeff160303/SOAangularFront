import { Component } from '@angular/core';
import { Router, RouterOutlet} from '@angular/router';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css'
})
export class FooterComponent {

  constructor(private router: Router) {

  }

  SingUp() {
    this.router.navigateByUrl('/login');
  }
  
}

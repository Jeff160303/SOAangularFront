import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-exito',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './exito.component.html',
  styleUrl: './exito.component.css'
})
export class ExitoComponent{

  constructor(private router: Router){}

  inicio(){
    this.router.navigateByUrl('/');
  }

}

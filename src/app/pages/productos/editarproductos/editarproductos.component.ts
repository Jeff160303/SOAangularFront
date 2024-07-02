import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { Producto } from '../../../models/producto.model';

@Component({
  selector: 'app-editarproductos',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './editarproductos.component.html',
  styleUrl: './editarproductos.component.css'
})
export class EditarproductosComponent implements OnInit {

  productos: Producto[] = [];

  constructor(private http: HttpClient, private router: Router) { }

  ngOnInit(): void {
    this.http.get<Producto[]>('http://localhost:8080/productos/listarproducto').subscribe(
      (data) => {
        this.productos = data;
      },
      error => {
        this.router.navigateByUrl('/desconectado');
      }
    );
  }

  editarProducto(idProducto: number): void {
    this.router.navigate(['/formularioeditar', idProducto]);
  }

}
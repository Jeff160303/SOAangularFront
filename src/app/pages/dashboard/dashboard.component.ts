import { Component, OnInit } from '@angular/core';
import { Router, RouterModule, RouterOutlet } from '@angular/router';
import { Producto } from '../../models/producto.model';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {

  productosMostrados: Producto[] = [];

  constructor(private http: HttpClient, private router: Router) { }

  ngOnInit(): void {
    this.http.get<Producto[]>('http://localhost:8080/productos/listarproducto').subscribe(
      data => {
        this.productosMostrados = data.slice(0, 6);
        this.actualizarURLImagenes();
      },
      error => {
        this.router.navigateByUrl('/desconectado');
      }
    );
  }

  detalleProducto(idProducto: number): void {
    this.router.navigate(['/detalleProducto', idProducto]);
  }

  actualizarURLImagenes(): void {
    this.productosMostrados.forEach(producto => {
      if (producto.imagenProducto) {
        producto.imagenProducto = `http://localhost:8080/imagenes/${producto.imagenProducto}`;
      }
    });
  }

}
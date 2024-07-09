import { Component } from '@angular/core';
import { AuthService, UserData } from '../../auth.service';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';
import { DetalleUsuario } from '../../models/detalles.models';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './perfil.component.html',
  styleUrl: './perfil.component.css'
})
export class PerfilComponent {
  userData: UserData | null = null;
  detallesUsuario: DetalleUsuario[] = [];
  editMode: boolean[] = [];
  agregarDireccionMode: boolean = false;
  direccionTemporal: DetalleUsuario = { idDetalleUsuarios: 0, dni: '', direccion: '', codigoPostal: '' };

  constructor(private authService: AuthService, private http: HttpClient) {}

  ngOnInit() {
    this.authService.userData$.subscribe(userData => {
      this.userData = userData;
      if (userData) {
        this.listarDetallesPorDni(userData.dni);
      }
    });
  }

  listarDetallesPorDni(dni: string) {
    const url = `http://localhost:8090/usuarios/detalle/listar/${dni}`;

    this.http.get<DetalleUsuario[]>(url)
      .pipe(
        catchError(error => {
          console.error('Error al cargar detalles de usuario:', error);
          return throwError(error);
        })
      )
      .subscribe(detalles => {
        this.detallesUsuario = detalles;
        this.editMode = new Array(detalles.length).fill(false);
      });
  }

  mostrarFormularioAgregarDireccion() {
    this.agregarDireccionMode = true;
  }

  cancelarAgregarDireccion() {
    this.agregarDireccionMode = false;
    this.direccionTemporal = { idDetalleUsuarios: 0, dni: '', direccion: '', codigoPostal: '' };
  }

  crearDireccion() {
    if (this.detallesUsuario.length < 2 && this.userData) {
      const nuevaDireccion = {
        dni: this.userData.dni,
        direccion: this.direccionTemporal.direccion,
        codigoPostal: this.direccionTemporal.codigoPostal
      };
  
      this.http.post<number>('http://localhost:8090/usuarios/detalle/agregar', nuevaDireccion)
        .subscribe(resultado => {
          console.log('Dirección agregada con éxito');
  
          this.detallesUsuario.push({
            ...this.direccionTemporal,
            idDetalleUsuarios: resultado
          });
  
          this.agregarDireccionMode = false;
          this.direccionTemporal = { idDetalleUsuarios: 0, dni: '', direccion: '', codigoPostal: '' };
          Swal.fire({
            title: 'Éxito',
            text: 'Dirección creada correctamente.',
            icon: 'success',
          });
        }, error => {
          console.error('Error al agregar dirección:', error);
          Swal.fire({
            title: 'Error',
            text: 'Hubo un problema al intentar agregar la dirección.',
            icon: 'error',
          });
        });
    }
  }

  editarDireccion(index: number) {
    this.editMode[index] = true;
  }

  confirmarCambio(index: number) {
    this.editMode[index] = false;
  
    const detalle = this.detallesUsuario[index];
    this.http.put<number>('http://localhost:8090/usuarios/detalle/actualizar', detalle)
      .subscribe(resultado => {
        console.log('Dirección actualizada con éxito');
  
        Swal.fire({
          title: 'Éxito',
          text: 'Dirección actualizada correctamente.',
          icon: 'success',
        });
      }, error => {
        console.error('Error al actualizar dirección:', error);
        Swal.fire({
          title: 'Error',
          text: 'Hubo un problema al intentar actualizar la dirección.',
          icon: 'error',
        });
      });
  }
  

  cancelarEdicion(index: number) {
    this.editMode[index] = false;
    this.listarDetallesPorDni(this.userData!.dni);
  }

  eliminarDireccion(index: number) {
    const idDetalleUsuarios = this.detallesUsuario[index].idDetalleUsuarios;
  
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'Esta acción eliminará la dirección permanentemente. ¿Deseas continuar?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.http.delete<number>(`http://localhost:8090/usuarios/detalle/eliminar/${idDetalleUsuarios}`)
          .subscribe(resultado => {
            console.log('Dirección eliminada con éxito');
  
            this.detallesUsuario.splice(index, 1);
  
            Swal.fire(
              '¡Eliminado!',
              'La dirección ha sido eliminada correctamente.',
              'success'
            );
          }, error => {
            console.error('Error al eliminar dirección:', error);
  
            Swal.fire({
              title: 'Error',
              text: 'Hubo un problema al intentar eliminar la dirección.',
              icon: 'error',
              confirmButtonText: 'Aceptar'
            });
          });
      }
    });
  }

  eliminarCuenta() {
    
  }

  generarIdUnico(): number {
    return Date.now();
  }
}

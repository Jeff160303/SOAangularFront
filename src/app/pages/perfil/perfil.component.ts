import { Component } from '@angular/core';
import { AuthService, UserData } from '../../auth.service';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';
import { DetalleUsuario } from '../../models/detalles.models';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './perfil.component.html',
  styleUrl: './perfil.component.css'
})
export class PerfilComponent {
  userData: any | null = null;
  detallesUsuario: DetalleUsuario[] = [];
  editMode: boolean[] = [];
  agregarDireccionMode: boolean = false;
  direccionTemporal: DetalleUsuario = { idDetalleUsuarios: 0, dni: '', direccion: '', codigoPostal: '' };

  constructor(private authService: AuthService, private http: HttpClient, private router: Router ) {
    this.userData = this.authService.getUserData();
  }

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

  eliminarCuenta(dni: string) {
    const codigo = Math.floor(1000 + Math.random() * 9000).toString();

    Swal.fire({
      title: 'Confirmación de eliminación',
      text: `Ingresa el siguiente código para confirmar: ${codigo}`,
      input: 'text',
      inputPlaceholder: 'Ingrese el código de 4 dígitos',
      showCancelButton: true,
      confirmButtonText: 'Confirmar',
      cancelButtonText: 'Cancelar',
      preConfirm: (inputValue) => {
        if (inputValue !== codigo) {
          Swal.showValidationMessage('El código ingresado es incorrecto');
        }
        return inputValue === codigo;
      }
    }).then((result) => {
      if (result.isConfirmed) {
        this.http.delete<number>(`http://localhost:8090/usuarios/eliminar/${dni}`)
          .subscribe(resultado => {
            console.log('Cuenta eliminada con éxito');

            Swal.fire(
              '¡Eliminado!',
              'Tu cuenta ha sido eliminada correctamente.',
              'success'
            );

            if (this.authService.getUserRole() !== 'error') {
              this.authService.clearUser();
              this.router.navigateByUrl('/');
            } else {
              this.router.navigateByUrl('/login');
            }
            

          }, error => {
            console.error('Error al eliminar cuenta:', error);

            Swal.fire({
              title: 'Error',
              text: 'Hubo un problema al intentar eliminar tu cuenta.',
              icon: 'error',
              confirmButtonText: 'Aceptar'
            });
          });
      }
    });
  }

  cambiarContrasena() {
    Swal.fire({
      title: 'Cambiar Contraseña',
      html:
        '<input style="width: 300px; text-align: center" id="swal-input1" class="swal2-input" type="password" placeholder="Contraseña Actual">' +
        '<input style="width: 300px; text-align: center" id="swal-input2" class="swal2-input" type="password" placeholder="Nueva Contraseña">' +
        '<input style="width: 300px; text-align: center" id="swal-input3" class="swal2-input" type="password" placeholder="Confirmar Nueva Contraseña">',
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: 'Confirmar',
      cancelButtonText: 'Cancelar',
      preConfirm: () => {
        const contrasenaActual = (document.getElementById('swal-input1') as HTMLInputElement).value;
        const nuevaContrasena = (document.getElementById('swal-input2') as HTMLInputElement).value;
        const confirmarContrasena = (document.getElementById('swal-input3') as HTMLInputElement).value;

        if (!contrasenaActual || !nuevaContrasena || !confirmarContrasena) {
          Swal.showValidationMessage('Todos los campos son obligatorios');
          return false;
        }

        if (nuevaContrasena !== confirmarContrasena) {
          Swal.showValidationMessage('Las contraseñas nuevas no coinciden');
          return false;
        }

        return { contrasenaActual, nuevaContrasena };
      }
    }).then((result) => {
      if (result.isConfirmed) {
        const payload = {
          dni: this.userData.dni,
          contrasenaActual: result.value.contrasenaActual,
          nuevaContrasena: result.value.nuevaContrasena
        };

        this.http.put<number>('http://localhost:8090/usuarios/actualizar', payload)
          .subscribe(response => {
            if (response > 0) {
              Swal.fire('¡Éxito!', 'Tu contraseña ha sido cambiada correctamente.', 'success');
            } else {
              Swal.fire('Error', 'Hubo un problema al cambiar tu contraseña. Verifica los datos proporcionados.', 'error');
            }
          }, error => {
            console.error('Error al cambiar la contraseña:', error);
            Swal.fire('Error', 'Hubo un problema al cambiar tu contraseña. Inténtalo nuevamente más tarde.', 'error');
          });
      }
    });
  }

  generarIdUnico(): number {
    return Date.now();
  }
}
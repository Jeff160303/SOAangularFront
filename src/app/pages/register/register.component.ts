import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  registerForm: FormGroup;

  constructor(private fb: FormBuilder, private http: HttpClient, private router: Router) {
    this.registerForm = this.fb.group({
      dni: ['', Validators.required],
      nombres: ['', Validators.required],
      apellidos: ['', Validators.required],
      numTelefono: ['', Validators.required],
      correo: ['', [Validators.required, Validators.email]],
      contrasena: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit() {
    if (this.registerForm.valid) {
      this.http.post('http://localhost:8090/usuarios/crear', this.registerForm.value)
        .subscribe({
          next: (response: any) => {
            console.log('Respuesta del servidor:', response);
            if (response === -1) {
              Swal.fire({
                title: 'Lo sentimos',
                text: 'El usuario ya existe en el sistema.',
                icon: 'warning',
              });
            } else if (response === 1) {
              Swal.fire({
                title: 'Bienvenid@ a la familia!',
                text: 'Usuario creado exitosamente.',
                icon: 'success',
              });
              this.sendWelcomeEmail();
              this.router.navigate(['/login']);
            } else {
              console.error('Respuesta inesperada del servidor');
            }
          },
          error: (error) => {
            console.error('Error en el registro', error);
            Swal.fire({
              title: 'Lo sentimos',
              text: 'Hubo un problema al intentar registrar el usuario. Por favor, intenta nuevamente más tarde.',
              icon: 'error',
            });
          }
        });
    }
  }

  sendWelcomeEmail() {
    const { correo, nombres, apellidos } = this.registerForm.value;
    const formData = new FormData();
    formData.append('email', correo);
    formData.append('name', `${nombres} ${apellidos}`);
  
    this.http.post('http://localhost:8060/email/bienvenida', formData)
      .subscribe({
        next: (response: any) => {
          console.log('Respuesta del servidor (correo de bienvenida):', response);
          Swal.fire({
            title: 'Correo Enviado!',
            text: 'Correo de bienvenida enviado exitosamente.',
            icon: 'success',
          });
        },
        error: (error) => {
          console.error('Error al enviar correo de bienvenida', error);
          Swal.fire({
            title: 'Error',
            text: 'Hubo un problema al intentar enviar el correo de bienvenida.',
            icon: 'error',
          });
        }
      });
  }

  iniciarsesion(){
    this.router.navigateByUrl('/login');
  }
}

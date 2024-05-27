import { UsuarioService } from './../services/usuario.service';
import { Component, inject } from '@angular/core';

@Component({
  selector: 'app-listar-usuarios',
  standalone: true,
  imports: [],
  templateUrl: './listar-usuarios.component.html',
  styleUrl: './listar-usuarios.component.css'
})
export default class ListarUsuariosComponent {
  private UsuarioService = inject(UsuarioService);

  usuarios: any[] = [];

  ngOnInit(): void {
    this.UsuarioService.list()
    .subscribe((usuarios: any) => {
      console.log(usuarios);
    })
  }
}

import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  private http = inject(HttpClient);

  list(){
    return this.http.get('http://localhost:8080/usuarios/listar');
  }

  get (dni: number){
    return this.http.get('http://localhost:8080/usuarios/listarporDni/${dni}');
  }

  create(usuario: any){
    return this.http.post('http://localhost:8080/usuarios/crear',usuario);
  }

  update(dni: number, usuario:any){
    return this.http.put('http://localhost:8080/usuarios/actualizar/${dni}',usuario);
  }

  delete(dni:number){
    return this.http.delete('http://localhost:8080/usuarios/eliminar/${}Adni');
  }
}

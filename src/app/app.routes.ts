// app.routes.ts
import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { LayoutComponent } from './pages/layout/layout.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { RegisterComponent } from './pages/register/register.component';
import { ListarproductosComponent } from './pages/listarproductos/listarproductos.component';
import { CrearproductosComponent } from './pages/productos/crearproductos/crearproductos.component';
import { EditarproductosComponent } from './pages/productos/editarproductos/editarproductos.component';
import { FormularioeditarComponent } from './pages/productos/formularioeditar/formularioeditar.component';
import { DetalleProductoComponent } from './pages/detalle-producto/detalle-producto.component';
import { CarritoComponent } from './pages/carrito/carrito.component';
import { DesconectadoComponent } from './reusables/desconectado/desconectado.component';
import { PerfilComponent } from './pages/perfil/perfil.component';
import { DeliveryComponent } from './pages/delivery/delivery.component';
import { ExitoComponent } from './pages/ventas/exito/exito.component';
import { DeliveryGestionComponent } from './pages/delivery/delivery-gestion/delivery-gestion.component';

export const routes: Routes = [
  {
    path: '',
    component: DashboardComponent
  },
  {
    path: 'dashboard',
    component: DashboardComponent
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'register',
    component: RegisterComponent,
    children: [
      {
        path: 'login',
        component: LoginComponent
      }
    ]
  },
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: '',
        component: DashboardComponent,
      },
      {
        path: 'login',
        component: LoginComponent
      },
      {
        path: 'register',
        component: RegisterComponent
      },
      {
        path: 'perfil',
        component: PerfilComponent
      },
      {
        path: 'delivery',
        component: DeliveryComponent
      },
      {
        path: 'productos',
        component: ListarproductosComponent
      },
      {
        path: 'crearproductos',
        component: CrearproductosComponent
      },
      {
        path: 'editarproductos',
        component: EditarproductosComponent
      },
      {
        path: 'formularioeditar/:id',
        component: FormularioeditarComponent
      },
      {
        path: 'detalleProducto/:id',
        component: DetalleProductoComponent
      },
      {
        path: 'carrito',
        component: CarritoComponent
      },
      {
        path: 'desconectado',
        component: DesconectadoComponent
      },
      {
        path: 'exito',
        component: ExitoComponent
      },
      {
        path: 'deliveryGestion',
        component: DeliveryGestionComponent
      }
    ]
  }
];

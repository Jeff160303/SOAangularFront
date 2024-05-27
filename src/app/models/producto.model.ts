import { DetalleProducto } from './detalleProducto.model';

export class Producto {
  idproducto: number;
  nombreProducto: string;
  catProducto: string;
  precioProducto: number;
  detalleProducto: DetalleProducto | null;

  constructor(idproducto: number, nombreProducto: string, catProducto: string, precioProducto: number, detalleProducto: DetalleProducto | null) {
    this.idproducto = idproducto;
    this.nombreProducto = nombreProducto;
    this.catProducto = catProducto;
    this.precioProducto = precioProducto;
    this.detalleProducto = detalleProducto;
  }
}
export class DetalleProducto {
  idDetallePro: number;
  idproducto: number;
  tallas: string;
  stock: string;
  imagenProducto: string;

  constructor(idDetallePro: number, idproducto: number, tallas: string, stock: string, imagenProducto: string) {
    this.idDetallePro = idDetallePro;
    this.idproducto = idproducto;
    this.tallas = tallas;
    this.stock = stock;
    this.imagenProducto = imagenProducto;
  }
}

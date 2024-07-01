export class Producto {
  idProducto: number;
  nombreProducto: string;
  catProducto: string;
  precioProducto: number;
  tallaS: number;
  tallaM: number;
  tallaL: number;
  imagenProducto: string;

  constructor(
    idProducto: number,
    nombreProducto: string,
    catProducto: string,
    precioProducto: number,
    tallaS: number,
    tallaM: number,
    tallaL: number,
    imagenProducto: string
  ) {
    this.idProducto = idProducto;
    this.nombreProducto = nombreProducto;
    this.catProducto = catProducto;
    this.precioProducto = precioProducto;
    this.tallaS = tallaS;
    this.tallaM = tallaM;
    this.tallaL = tallaL;
    this.imagenProducto = imagenProducto;
  }
}

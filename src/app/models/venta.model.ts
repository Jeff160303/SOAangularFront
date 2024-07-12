export interface Venta {
    idVenta: number;
    fechaEmision: string;
    dni: string;
    nombres: string;
    apellidos: string;
    tipoVenta: string;
    direccion: string;
    total: number;
    estado: string;
    nuevoEstado?: string;
  }
  
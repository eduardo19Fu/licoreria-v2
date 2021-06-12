import { Factura } from './factura';

export class Cliente {

    idCliente: number;
    nombre: string;
    nit: string;
    direccion: string;
    fechaRegistro: Date;

    facturas: Factura[] = [];
}

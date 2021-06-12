import { Cliente } from './cliente';
import { Estado } from './estado';
import { DetalleFactura } from './detalle-factura';
import { UsuarioAuxiliar } from './auxiliar/usuario-auxiliar';

export class Factura {
    idFactura: number;
    noFactura: number;
    total: number;
    fecha: Date;
    serie: string;

    estado: Estado;
    usuario: UsuarioAuxiliar;
    cliente: Cliente;
    itemsFactura: DetalleFactura[] = [];

    calcularTotal(): number{
        this.total = 0;
        this.itemsFactura.forEach((item: DetalleFactura) => {
            this.total += item.calcularImporte();
        });

        return this.total;
    }
}

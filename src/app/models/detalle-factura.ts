import { Producto } from './producto';

export class DetalleFactura {
    idDetalle: number;
    cantidad = 1;
    subTotal: number;

    producto: Producto;

    public calcularImporte(): number{
        return this.producto.precioVenta * this.cantidad;
    }
}

import { Component, OnInit } from '@angular/core';

import { UsuarioAuxiliar } from 'src/app/models/auxiliar/usuario-auxiliar';
import { Cliente } from 'src/app/models/cliente';
import { Correlativo } from 'src/app/models/correlativo';
import { DetalleFactura } from 'src/app/models/detalle-factura';
import { Factura } from 'src/app/models/factura';
import { Producto } from 'src/app/models/producto';

import { AuthService } from 'src/app/services/auth.service';
import { ClienteService } from 'src/app/services/cliente.service';
import { CorrelativoService } from 'src/app/services/correlativos/correlativo.service';
import { ClienteCreateService } from 'src/app/services/facturas/cliente-create.service';
import { FacturaService } from 'src/app/services/facturas/factura.service';
import { ProductoService } from 'src/app/services/producto.service';
import { UsuarioService } from 'src/app/services/usuarios/usuario.service';

import swal from 'sweetalert2';

@Component({
  selector: 'app-create-factura',
  templateUrl: './create-factura.component.html',
  styleUrls: ['./create-factura.component.css']
})
export class CreateFacturaComponent implements OnInit {

  title: string;
  nitIngresado: string;

  producto: Producto;
  cliente: Cliente;
  usuario: UsuarioAuxiliar;
  factura: Factura;
  correlativo: Correlativo;

  /* AutomComplete
  autocompleteControl = new FormControl();
  productos: string[] = ['One', 'Two', 'Three'];
  productosFiltrados: Observable<string[]>;
  */

  constructor(
    private facturaService: FacturaService,
    private productoService: ProductoService,
    private clienteService: ClienteService,
    private usuarioService: UsuarioService,
    private clienteCreateService: ClienteCreateService,
    private correlativoService: CorrelativoService,
    public authService: AuthService
  ) {
    this.title = 'Crear Factura';
    this.cliente = new Cliente();
    this.usuario = new UsuarioAuxiliar();
    this.factura = new Factura();
    this.correlativo = new Correlativo();
    this.producto = new Producto();
  }

  ngOnInit(): void {
    this.usuarioService.getUsuario(this.authService.usuario.idUsuario).subscribe(
      usuario => {
        this.usuario = usuario;
        this.cargarCorrelativo();
      }
    );

    // this.usuario = this.authService.usuario;
    // this.cargarCorrelativo();

    /* AutoComplete
    this.productosFiltrados = this.autocompleteControl.valueChanges
      .pipe(
        startWith(''),
        map(value => this._filter(value))
      );*/
  }

  /* AutoComplete
  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.productos.filter(option => option.toLowerCase().includes(filterValue));
  }*/

  buscarCliente(): void {
    const nit = ((document.getElementById('buscar') as HTMLInputElement)).value;

    if (nit) {
      this.clienteService.getClienteByNit(nit).subscribe(
        cliente => {
          this.cliente = cliente;
        },
        error => {
          if (error.status === 400) {
            swal.fire(`Error: ${error.status}`, 'Petición Equivocada', 'error');
          }
          if (error.status === 404) {
            this.nitIngresado = nit;
            this.clienteCreateService.abrirModal();
          }
        }
      );
    } else {
      swal.fire('NIT Vacío', 'Ingrese un valor valido para realizar la búsqueda.', 'warning');
    }
  }

  cargarCliente(event): void {
    this.cliente = event;
  }

  cargarCorrelativo(): void {
    if (this.usuario) {
      this.correlativoService.getCorrelativoPorUsuario(this.usuario.idUsuario).subscribe(
        correlativo => {
          this.correlativo = correlativo;
        },
        error => {
          swal.fire('Error al cargar correlativo', error.error, 'error');
        }
      );
    }
  }

  buscarProducto(): void {
    const codigo = ((document.getElementById('codigo') as HTMLInputElement)).value;

    if (codigo) {
      this.productoService.getProductoByCode(codigo).subscribe(
        producto => {
          this.producto = producto;
          (document.getElementById('cantidad') as HTMLInputElement).focus();
        },
        error => {
          if (error.status === 400) {
            swal.fire(`Error: ${error.status}`, 'Petición no se puede llevar a cabo.', 'error');
          }

          if (error.status === 404) {
            swal.fire(`Error: ${error.status}`, error.error.mensaje, 'error');
          }
        }
      );
    } else {
      swal.fire('Código Inválido', 'Ingrese un código de producto válido para realizar la búsqueda.', 'warning');
    }
  }

  agregarLinea(): void {
    if (!this.cliente) { // Comprueba que el cliente exista
      swal.fire('Ha ocurrido un Problema', 'Por favor, elija un cliente antes de llevar a cabo la venta.', 'error');
    } else {
      if (this.producto) { // comprueba que el producto exista
        const item = new DetalleFactura();

        item.cantidad = +((document.getElementById('cantidad') as HTMLInputElement)).value; // valor obtenido del formulario de cantidad

        if (item.cantidad > this.producto.stock) {
          swal.fire('Stock Insuficiente', 'No existen las suficientes existencias de este producto.', 'warning');
          return;
        } else {
          if (item.cantidad && item.cantidad !== 0) {
            if (this.existeItem(this.producto.idProducto)) {
              this.incrementaCantidad(this.producto.idProducto, item.cantidad);
              this.producto = new Producto();
              (document.getElementById('cantidad') as HTMLInputElement).value = '';
            } else {
              item.producto = this.producto;
              item.subTotal = item.calcularImporte();
              this.factura.itemsFactura.push(item);
              this.producto = new Producto();

              (document.getElementById('cantidad') as HTMLInputElement).value = '';
            }

          } else if (item.cantidad === 0) {
            swal.fire('Cantidad Erronéa', 'La cantidad a agregar debe ser mayor a 0.', 'warning');
          } else if (!item.cantidad) {
            swal.fire('Valor Inválido', 'La cantidad no puede estar vacía.  Ingrese un valor válido.', 'warning');
          }
        }
      }
    }
  }

  actualizarCantidad(idProducto: number, event: any): void {
    const cantidad = event.target.value as number;

    this.factura.itemsFactura = this.factura.itemsFactura.map((item: DetalleFactura) => {
      if (idProducto === item.producto.idProducto) {
        if (cantidad > item.producto.stock) {
          swal.fire('Stock Insuficiente', 'No existen las suficientes existencias de este producto.', 'warning');
        } else {
          item.cantidad = cantidad;
        }
      }

      return item;
    });
  }

  existeItem(id: number): boolean {
    let existe = false;
    this.factura.itemsFactura.forEach((item: DetalleFactura) => {
      if (id === item.producto.idProducto) {
        existe = true;
      }
    });
    return existe;
  }

  incrementaCantidad(idProducto: number, cantidad: number): void {
    this.factura.itemsFactura = this.factura.itemsFactura.map((item: DetalleFactura) => {
      if (idProducto === item.producto.idProducto) {
        item.cantidad = item.cantidad + cantidad;
      }

      return item;
    });
  }

  eliminarItem(index: number): void {
    this.factura.itemsFactura.splice(index, 1);
  }

  createFactura(): void {
    this.factura.noFactura = this.correlativo.correlativoActual;
    this.factura.serie = this.correlativo.serie;
    this.factura.cliente = this.cliente;
    this.factura.usuario = this.usuario;
    this.factura.total = this.factura.calcularTotal();

    this.facturaService.create(this.factura).subscribe(
      response => {
        this.cliente = new Cliente();
        this.factura = new Factura();
        this.cargarCorrelativo();
        (document.getElementById('buscar') as HTMLInputElement).value = '';
        swal.fire('Venta Realizada', `Factura No. ${response.factura.noFactura} creada con éxito!`, 'success');
        (document.getElementById('buscar') as HTMLInputElement).focus();

        this.facturaService.getBillPDF(response.factura.idFactura).subscribe(res => {
          const url = window.URL.createObjectURL(res.data);
          const a = document.createElement('a');
          document.body.appendChild(a);
          a.setAttribute('style', 'display: none');
          a.setAttribute('target', 'blank');
          a.href = url;
          /*
            opcion para pedir descarga de la respuesta obtenida
            a.download = response.filename;
          */
          window.open(a.toString(), '_blank');
          window.URL.revokeObjectURL(url);
          a.remove();
        },
        error => {
          console.log(error);
        });
      }
    );
  }

}

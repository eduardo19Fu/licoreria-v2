import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { AuthService } from 'src/app/services/auth.service';
import { DetailService } from 'src/app/services/facturas/detail.service';
import { FacturaService } from 'src/app/services/facturas/factura.service';

import { Factura } from 'src/app/models/factura';
import { Usuario } from 'src/app/models/usuario';

import { JqueryConfigs } from '../../utils/jquery/jquery-utils';
import swal from 'sweetalert2';

@Component({
  selector: 'app-facturas',
  templateUrl: './facturas.component.html',
  styleUrls: ['./facturas.component.css']
})
export class FacturasComponent implements OnInit {

  title: string;

  facturas: Factura[];

  usuario: Usuario;
  facturaSeleccionada: Factura;
  jQueryConfigs: JqueryConfigs;

  swalWithBootstrapButtons = swal.mixin({
    customClass: {
      confirmButton: 'btn btn-success',
      cancelButton: 'btn btn-danger'
    },
    buttonsStyling: true
  });

  constructor(
    private detailService: DetailService,
    private facturaService: FacturaService,
    private activatedRoute: ActivatedRoute,
    public auth: AuthService
  ) {
    this.title = 'Facturas';
    this.jQueryConfigs = new JqueryConfigs();
    this.usuario = auth.usuario;
  }

  ngOnInit(): void {
    this.getFacturas();
  }

  getFacturas(): void {
    this.facturaService.getFacturas().subscribe(
      facturas => {
        this.facturas = facturas;
        this.jQueryConfigs.configDataTable('facturas');
        this.jQueryConfigs.configToolTip();
      }
    );
  }

  abrirDetalle(factura: Factura): void{
    this.facturaSeleccionada = factura;
    this.detailService.abrirModal();
  }

  cancel(factura: Factura): void{
    this.swalWithBootstrapButtons.fire({
      title: '¿Está seguro?',
      text: `¿Seguro que desea anular la factura No. ${factura.noFactura}`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: '¡Si, anular!',
      cancelButtonText: '¡No, cancelar!',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {

        // aqui va el codigo de confirmación para anular factura
        this.facturaService.cancel(factura.idFactura, this.usuario.idUsuario).subscribe(
          response => {
            this.swalWithBootstrapButtons.fire(
              `${response.mensaje}`,
              `La factura No. ${factura.noFactura} ha sido anulada con éxito`,
              'success'
            );
          }
        );

      } else if (
        /* Read more about handling dismissals below */
        result.dismiss === swal.DismissReason.cancel
      ) {
        this.swalWithBootstrapButtons.fire(
          'Proceso Cancelado',
          `La factura No. ${factura.noFactura} no fué anulada.`,
          'error'
        );
      }
    });
  }

}

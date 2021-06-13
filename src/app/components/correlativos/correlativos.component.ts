import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Correlativo } from '../../models/correlativo';

import { CorrelativoService } from '../../services/correlativos/correlativo.service';
import { AuthService } from '../../services/auth.service';

import { JqueryConfigs } from '../../utils/jquery/jquery-utils';

@Component({
  selector: 'app-correlativos',
  templateUrl: './correlativos.component.html',
  styles: [
  ]
})
export class CorrelativosComponent implements OnInit {

  title: string;
  jQueryConfigs: JqueryConfigs;

  correlativos: Correlativo[];

  constructor(
    private correlativoService: CorrelativoService,
    public authService: AuthService,
    private activatedRoute: ActivatedRoute
  ) {
    this.title = 'Listado de Correlativos';
    this.jQueryConfigs = new JqueryConfigs();
  }

  ngOnInit(): void {
    this.getCorrelativos();
  }

  getCorrelativos(): void{
    this.correlativoService.getCorrelativos().subscribe(
      correlativos => {
        this.correlativos = correlativos;
        this.jQueryConfigs.configDataTable('correlativos');
      }
    );
  }

}

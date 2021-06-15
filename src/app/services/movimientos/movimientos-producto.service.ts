import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

import { MovimientoProducto } from 'src/app/models/movimiento-producto';

import { global } from '../global';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class MovimientosProductoService {

  url: string;

  constructor(
    private http: HttpClient,
    private router: Router
  ) {
    this.url = global.url;
  }

  getMovimientosProducto(): Observable<MovimientoProducto[]>{
    return this.http.get<MovimientoProducto[]>(`${this.url}/movimientos`);
  }

  getMovimientosProductoPage(idproducto: number, page: number): Observable<any>{
    return this.http.get<any>(`${this.url}/movimientos/${idproducto}/${page}`).pipe(
      map((response: any) => {
        (response.content as MovimientoProducto[]).map(movimientoProducto => {
          return movimientoProducto;
        });
        return response;
      })
    );
  }

  create(movimientoProducto: MovimientoProducto): Observable<any>{
    return this.http.post<any>(`${this.url}/movimientos`, movimientoProducto).pipe(
      catchError(e => {
        Swal.fire(e.error.mensaje, e.error.error, 'error');
        return throwError(e);
      })
    );
  }
}

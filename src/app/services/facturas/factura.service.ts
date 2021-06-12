import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { Factura } from 'src/app/models/factura';

import { global } from '../global';
import swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class FacturaService {

  private url: string;

  constructor(
    private http: HttpClient,
    private router: Router
  ) {
    this.url = global.url;
  }

  getFacturas(): Observable<Factura[]>{
    return this.http.get<Factura[]>(`${this.url}/facturas`);
  }

  getFacturasPage(page: number): Observable<any>{
    return this.http.get<any>(`${this.url}/facturas/page/${page}`).pipe(
      map((response: any) => {
        (response.content as Factura[]).map(factura => {
          return factura;
        });
        return response;
      })
    );
  }

  getFactura(id: number): Observable<Factura>{
    return this.http.get<Factura>(`${this.url}/facturas/factura/${id}`).pipe(
      catchError(e => {
        swal.fire(e.error.mensaje, e.error.error, 'error');
        return throwError(e);
      })
    );
  }

  cancel(id: number): Observable<any>{
    return this.http.delete<any>(`${this.url}/facturas/cancel/${id}`).pipe(
      catchError(e => {
        swal.fire(e.error.mensaje, e.error.error, 'error');
        return throwError(e);
      })
    );
  }

  create(factura: Factura): Observable<any>{
    return this.http.post<any>(`${this.url}/facturas`, factura).pipe(
      catchError(e => {
        swal.fire(e.error.mensaje, e.error.error, 'error');
        return throwError(e);
      })
    );
  }
}

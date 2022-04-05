import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { combineLatest, Observable, of } from 'rxjs';
import { Pais, PaisSmall } from '../interfaces/paises.interface';

@Injectable({
  providedIn: 'root'
})
export class PaisesService {
  private baseUrl: string = 'https://restcountries.com/v3.1'
  private _regiones: string[] = ['Africa', 'Americas', 'Asia', 'Europe', 'Oceania'];
  get httpParams() {
    return new HttpParams().set('fields', 'cca3,name');
  }
  get regiones(): string[] {
    return [...this._regiones]
  }
  constructor(private http: HttpClient) { }

  getPaisesPorRegion(region: string): Observable<PaisSmall[]> {
    const url: string = `${this.baseUrl}/region/${region}`
    return this.http.get<PaisSmall[]>(url, { params: this.httpParams })
  }
  getPaisPorCodigo(codigo: string): Observable<Pais[] | null> {
    if (!codigo) {
      return of(null)
    }
    const url = ` ${this.baseUrl}/alpha/${codigo}`;
    return this.http.get<Pais[]>(url);
  }

  getPaisPorCodigoSmall(codigo: string): Observable<PaisSmall> {
    const url = ` ${this.baseUrl}/alpha/${codigo}`;
    return this.http.get<PaisSmall>(url, { params: this.httpParams });
  }

  getPaisesPorCodigos(borders: Pais[]): Observable<PaisSmall[]> {
    if (!borders) {
      return of([]);
    }
    const peticiones: Observable<PaisSmall>[] = [];
    borders?.forEach(element => {
      element.borders.forEach(codigo => {
        const peticion = this.getPaisPorCodigoSmall(codigo);
        peticiones.push(peticion);
      });
    })
    return combineLatest(peticiones);

  }
}

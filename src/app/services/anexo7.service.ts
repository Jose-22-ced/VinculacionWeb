import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Anexo7, HorasPersonasResponse, TotalHorasResponse} from "../models/anexo7";
import {map, Observable} from "rxjs";
import {Anexo61} from "../models/anexo61";

@Injectable({
  providedIn: 'root'
})
export class Anexo7Service {

  private urlEndPoint: string = 'http://localhost:8080/api/anexo7';

  private httpHeaders = new HttpHeaders({
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ' + JSON.parse(sessionStorage["user"]).token
  })

  constructor(private http: HttpClient) {
  }

  saveAnexo7(anexo7: Anexo7): Observable<Anexo7> {
    console.log(anexo7);
    return this.http.post<Anexo7>(this.urlEndPoint, anexo7, {headers: this.httpHeaders})
  }

  updateAnexo7(anexo7: Anexo7): Observable<Anexo7> {
    console.log(anexo7);
    return this.http.put<Anexo7>(this.urlEndPoint, anexo7, {headers: this.httpHeaders})
  }

  getanexo7(idProyecto: Number): Observable<Anexo7> {
    return this.http.get(this.urlEndPoint + "/proyecto/" + idProyecto, {headers: this.httpHeaders}).pipe(map(Response => Response as Anexo7))
  }

  getAnexo7All():Observable<Anexo7[]>{
    return this.http.get(this.urlEndPoint+"/all",{headers: this.httpHeaders}).pipe(map(Response => Response as Anexo7[]))

  }
  deleteAnexo7(id?: Number){
    return this.http.delete<Anexo7>(this.urlEndPoint+'/'+id,{headers: this.httpHeaders})
  }
  getanexo7ById(id: number): Observable<Anexo7> {
    return this.http.get(this.urlEndPoint + '/' + id, {headers: this.httpHeaders}).pipe(map(Response => Response as Anexo7))
  }

  docentesPart(idProyecto:Number):Observable<TotalHorasResponse[]>{
    return this.http.get("http://localhost:8080/api/informeSeguimiento/proyecto/"+idProyecto+"/horasdocentes",{headers: this.httpHeaders}).pipe(map(Response => Response as TotalHorasResponse[]))

  }
  docentesEst(idProyecto:Number):Observable<TotalHorasResponse[]>{
    return this.http.get("http://localhost:8080/api/informeSeguimiento/proyecto/"+idProyecto+"/horasestudiantes",{headers: this.httpHeaders}).pipe(map(Response => Response as TotalHorasResponse[]))

  }

  actividadesParticipantes(idProyecto:Number):Observable<HorasPersonasResponse[]>{
    return this.http.get("http://localhost:8080/api/informeSeguimiento/proyecto/"+idProyecto+"/horas",{headers: this.httpHeaders}).pipe(map(Response => Response as HorasPersonasResponse[]))

  }
}

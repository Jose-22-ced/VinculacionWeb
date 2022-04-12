import { Injectable } from '@angular/core';
import {Carreras} from "../models/carreras";
import {map, Observable} from "rxjs";
import {HttpClient, HttpHeaders} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class CarrerasService {

  private urlEndPoint:string='http://localhost:8080/api/carreras';
  private httpHeaders = new HttpHeaders({'Content-Type':'application/json','Authorization':'Bearer '+JSON.parse(sessionStorage['user']).token})

  constructor(private http:HttpClient) { }

  getCarreras():Observable<Carreras[]>{
    return this.http.get(this.urlEndPoint,{headers: this.httpHeaders}).pipe(map(
      data => data as Carreras[]
    ));
  }
  getCarrerabyCodigo(codigo:String):Observable<Carreras>{
    return this.http.get(this.urlEndPoint+"/nombre/"+codigo,{headers: this.httpHeaders}).pipe(map(Response => Response as Carreras))
  }
}

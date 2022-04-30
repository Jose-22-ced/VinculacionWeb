import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {map, Observable} from "rxjs";
import {Informeaceptacion} from "../models/informeaceptacion";

@Injectable({
  providedIn: 'root'
})
export class InformedeaceptacionestdiatesService {

  private urlEndPoint:string='http://localhost:8080/api/informeInicial';

  private httpHeaders = new HttpHeaders({'Content-Type':'application/json','Authorization':'Bearer '+JSON.parse(sessionStorage["user"]).token})

  constructor(private http:HttpClient) {
  }
  savePreInforme(preinforme: Informeaceptacion):Observable<Informeaceptacion>{
    //console.log(preinforme);
    return this.http.post<Informeaceptacion>(this.urlEndPoint,preinforme,{headers: this.httpHeaders})
  }
  getpreinformeById(proyectoId?:Number):Observable<Informeaceptacion[]>{
    return this.http.get(this.urlEndPoint+"/proyecto/"+proyectoId,{headers: this.httpHeaders}).pipe(map(Response => Response as Informeaceptacion[]))
  }
  getAll():Observable<Informeaceptacion[]>{
    return this.http.get(this.urlEndPoint+"/all",{headers: this.httpHeaders}).pipe(map(Response => Response as Informeaceptacion[]))
  }
  updatepreinforme(preinforme: Informeaceptacion):Observable<Informeaceptacion>{
    //console.log(preinforme);
    return this.http.put<Informeaceptacion>(this.urlEndPoint,preinforme,{headers: this.httpHeaders})
  }
}

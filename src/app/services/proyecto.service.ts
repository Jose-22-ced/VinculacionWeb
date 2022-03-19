import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {map, Observable} from "rxjs";
import {Proyectos} from "../models/proyectos";

@Injectable({
  providedIn: 'root'
})
export class ProyectoService {

  private urlEndPoint:string='http://localhost:8080/api/proyectos';
  private httpHeaders = new HttpHeaders({'Content-Type':'application/json','Authorization':'Bearer '+JSON.parse(sessionStorage['user']).token})

  constructor(private http:HttpClient) { }

  getProyectos():Observable<Proyectos[]>{
    return this.http.get(this.urlEndPoint+"/all",{headers: this.httpHeaders}).pipe(map(Response => Response as Proyectos[]))
  }

  saveProyectos(proyectos: Proyectos):Observable<Proyectos>{
    console.log(proyectos);
    return this.http.post<Proyectos>(this.urlEndPoint+"/save",proyectos,{headers: this.httpHeaders})
  }

  updateProyectos(proyectos: Proyectos):Observable<Proyectos>{
    console.log(proyectos);
    return this.http.put<Proyectos>(this.urlEndPoint+"/update",proyectos,{headers: this.httpHeaders})
  }

  deleteProyectos(id?: Number){
    return this.http.delete<Proyectos>(this.urlEndPoint+'/'+id,{headers: this.httpHeaders})
  }

  getProyectobyid(id:number):Observable<Proyectos>{
    return this.http.get(this.urlEndPoint+"/"+id,{headers: this.httpHeaders}).pipe(map(Response => Response as Proyectos))

  }



}

import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Anexo8} from "../models/anexo8";
import {map, Observable} from "rxjs";
import {Entidadbeneficiaria} from "../models/entidadbeneficiaria";
import {DirectorNombres} from "../models/directorNombres";
import {Anexo11} from "../models/anexo11";
import {User} from "../models/user";
import {Anexo6} from "../models/anexo6";
import {Proyectos} from "../models/proyectos";
import {Anexo61} from "../models/anexo61";

@Injectable({
  providedIn: 'root'
})
export class Anexo11Service {
  private urlEndPoint: string = 'http://localhost:8080/api/anexo11';
  private urlt: string = 'http://localhost:8080/api/auth/usuario';
  private httpHeaders = new HttpHeaders({
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ' + JSON.parse(sessionStorage["user"]).token
  })

  constructor(private http: HttpClient) {
  }
  getusuario(cedula:String): Observable<User> {
    return this.http.get(this.urlt +"/"+ cedula, {headers: this.httpHeaders}).pipe(map(Response => Response as User))

  }
  updateanexo11(anexo11: Anexo11): Observable<Anexo11> {
    //console.log(anexo11);
    return this.http.put<Anexo11>(this.urlEndPoint, anexo11, {headers: this.httpHeaders})
  }

  getAll(): Observable<Anexo11[]> {
    return this.http.get(this.urlEndPoint+"/all", {headers: this.httpHeaders}).pipe(map(Response => Response as Anexo11[]))
  }
  getAnexo11byid(id?:Number):Observable<Anexo11>{
    return this.http.get(this.urlEndPoint+"/"+id,{headers: this.httpHeaders}).pipe(map(Response => Response as Anexo11))
  }

  saveAnexo11(anexo11: Anexo11): Observable<Anexo11> {
    //console.log(anexo11);
    return this.http.post<Anexo11>(this.urlEndPoint, anexo11, {headers: this.httpHeaders})
  }
  deleteAnexo11(id?: Number){
    return this.http.delete<Anexo11>(this.urlEndPoint+'/'+id,{headers: this.httpHeaders})
  }
  getAnexo11byidproyecto(idProyecoPPP?:number):Observable<Anexo11[]>{
    return this.http.get(this.urlEndPoint+"/allByProyecto/"+idProyecoPPP,{headers: this.httpHeaders}).pipe(map(Response => Response as Anexo11[]))
  }
}

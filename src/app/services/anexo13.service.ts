import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Anexo13} from "../models/anexo13";
import {map, Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class Anexo13Service {

  private urlEndPoint:string='http://localhost:8080/api/anexo13';

  private httpHeaders = new HttpHeaders({'Content-Type':'application/json','Authorization':'Bearer '+JSON.parse(sessionStorage["user"]).token})

  constructor(private http:HttpClient) { }

  saveAnexo13(anexo13: Anexo13):Observable<Anexo13>{
    //console.log(anexo13);
    return this.http.post<Anexo13>(this.urlEndPoint,anexo13,{headers: this.httpHeaders})
  }
  updateAnexo13(anexo13: Anexo13):Observable<Anexo13>{
    //console.log(anexo13);
    return this.http.put<Anexo13>(this.urlEndPoint,anexo13,{headers: this.httpHeaders})
  }
  getAnexo13by(idproyecto:Number):Observable<Anexo13[]>{
    return this.http.get(this.urlEndPoint+"/proyecto/"+idproyecto,{headers: this.httpHeaders}).pipe(map(Response => Response as Anexo13[]))
  }
}

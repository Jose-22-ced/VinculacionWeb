import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Anexo10} from "../models/anexo10";
import {map, Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class Anexo10Service {

  private urlEndPoint:string='http://localhost:8080/api/anexo10';

  private httpHeaders = new HttpHeaders({'Content-Type':'application/json','Authorization':'Bearer '+JSON.parse(sessionStorage['user']).token})

  constructor(private http:HttpClient) { }


  saveAnexo10(anexo10: Anexo10):Observable<Anexo10>{
    console.log(anexo10.documento);
    return this.http.post<Anexo10>(this.urlEndPoint,anexo10,{headers: this.httpHeaders})
  }
  updateAnexo10(anexo10: Anexo10):Observable<Anexo10>{

    return this.http.put<Anexo10>(this.urlEndPoint,anexo10,{headers: this.httpHeaders})
  }
  getAnexo10All():Observable<Anexo10[]>{
    return this.http.get(this.urlEndPoint+"/all",{headers: this.httpHeaders}).pipe(map(Response => Response as Anexo10[]))
  }
}

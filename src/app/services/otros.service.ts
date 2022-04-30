import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {map, Observable} from "rxjs";
import {CarreasAlumo} from "../models/anexo3";
import {Docentes} from "../models/docentes";
import {Codigocarrera} from "../models/codigocarrera";

@Injectable({
  providedIn: 'root'
})
export class OtrosService {

  private urlEndPoint:string='http://localhost:8080/api';

  private httpHeaders = new HttpHeaders({'Content-Type':'application/json','Authorization':'Bearer '+JSON.parse(sessionStorage["user"]).token})

  constructor(private http:HttpClient) { }

  getCarrera(cedula:String):Observable<CarreasAlumo>{
    return this.http.get(this.urlEndPoint+"/auth/"+cedula,{headers: this.httpHeaders}).pipe(map((Response: CarreasAlumo) => Response as CarreasAlumo))
  }
  getCarreraDocente(cedula:String):Observable<Codigocarrera[]>{
    return this.http.get(this.urlEndPoint+"/docentes/"+cedula+"/carreras",{headers: this.httpHeaders}).pipe(map(Response => Response as Codigocarrera[]))
  }

}

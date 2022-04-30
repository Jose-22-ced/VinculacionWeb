import {Injectable} from "@angular/core";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Anexo9} from "../models/anexo9";
import {map, Observable} from "rxjs";
import {Anexo6} from "../models/anexo6";
import {Anexo61} from "../models/anexo61";
import {Anexo12} from "../models/anexo12";

@Injectable({
  providedIn: 'root'
})
export class Anexo12Service {
  private urlEndPoint:string='http://localhost:8080/api/anexo12';

  private httpHeaders = new HttpHeaders({'Content-Type':'application/json','Authorization':'Bearer '+JSON.parse(sessionStorage["user"]).token})

  constructor(private http:HttpClient) { }
  saveAnexo(anexo12: Anexo12):Observable<Anexo12>{
    //console.log(anexo12);
    return this.http.post<Anexo12>(this.urlEndPoint,anexo12,{headers: this.httpHeaders})
  }


  getAnexo():Observable<Anexo12[]>{
    return this.http.get(this.urlEndPoint+"/all",{headers: this.httpHeaders}).pipe(map(Response => Response as Anexo12[]))

  }
  getAnexo12_porapoyo(cedula:String):Observable<Anexo12[]>{
    return this.http.get(this.urlEndPoint+"/allApoyo/"+cedula,{headers: this.httpHeaders}).pipe(map(Response => Response as Anexo12[]))
  }
  deleteAnexo12(id?: Number){
    return this.http.delete<Anexo9>(this.urlEndPoint+'/'+id,{headers: this.httpHeaders})
  }

  getAnexo12byidproyecto(idProyecoPPP?:number):Observable<Anexo12[]>{
    return this.http.get(this.urlEndPoint+"/allProyecto/"+idProyecoPPP,{headers: this.httpHeaders}).pipe(map(Response => Response as Anexo12[]))
  }
}

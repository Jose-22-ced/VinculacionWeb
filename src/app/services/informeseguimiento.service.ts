import {Injectable} from "@angular/core";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Anexo9} from "../models/anexo9";
import {map, Observable} from "rxjs";
import {InformeSeguimiento} from "../models/seguimiento";

@Injectable({
  providedIn: 'root'
})
export class InformeSeguimientoService {
  private urlEndPoint:string='http://localhost:8080/api/informeSeguimiento';

  private httpHeaders = new HttpHeaders({'Content-Type':'application/json','Authorization':'Bearer '+JSON.parse(sessionStorage["user"]).token})

  constructor(private http:HttpClient) { }
  saveAnexo(informe: InformeSeguimiento):Observable<InformeSeguimiento>{
    console.log(informe);
    return this.http.post<InformeSeguimiento>(this.urlEndPoint,informe,{headers: this.httpHeaders})
  }
  updateAnexo(informe:InformeSeguimiento):Observable<InformeSeguimiento>{
    console.log(informe)
    return this.http.put<Anexo9>(this.urlEndPoint,informe,{headers:this.httpHeaders})
  }

  getAnexo():Observable<Anexo9[]>{
    return this.http.get(this.urlEndPoint+"/all",{headers: this.httpHeaders}).pipe(map(Response => Response as Anexo9[]))

  }
  getInforme_porDirector(cedula:String):Observable<InformeSeguimiento[]>{
    return this.http.get(this.urlEndPoint+"/director/"+cedula,{headers: this.httpHeaders}).pipe(map(Response => Response as InformeSeguimiento[]))
  }
  getInforme_porCV(cedula:String):Observable<InformeSeguimiento[]>{
    return this.http.get(this.urlEndPoint+"/cv/"+cedula,{headers: this.httpHeaders}).pipe(map(Response => Response as InformeSeguimiento[]))
  }

  deleteAnexo(id?: Number){
    return this.http.delete<InformeSeguimiento>(this.urlEndPoint+'/'+id,{headers: this.httpHeaders})
  }
  getInforme_porid(id:Number):Observable<InformeSeguimiento>{
    return this.http.get(this.urlEndPoint+"/byId/"+id,{headers: this.httpHeaders}).pipe(map(Response => Response as InformeSeguimiento))
  }
}


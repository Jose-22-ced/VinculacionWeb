import {Injectable} from "@angular/core";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {InformeSeguimiento} from "../models/seguimiento";
import {map, Observable} from "rxjs";
import {InformeFinal} from "../models/final";

@Injectable({
  providedIn: 'root'
})
export class InformeFinalService {
  private urlEndPoint:string='http://localhost:8080/api/informeFinal';

  private httpHeaders = new HttpHeaders({'Content-Type':'application/json','Authorization':'Bearer '+JSON.parse(sessionStorage["user"]).token})
  constructor(private http:HttpClient) { }
  saveAnexo(informe: InformeFinal):Observable<InformeFinal>{
    console.log(informe);
    return this.http.post<InformeFinal>(this.urlEndPoint,informe,{headers: this.httpHeaders})
  }
  updateAnexo(informe:InformeFinal):Observable<InformeFinal>{
    console.log(informe)
    return this.http.put<InformeFinal>(this.urlEndPoint,informe,{headers:this.httpHeaders})
  }
  getInforme_porDirector(cedula:String):Observable<InformeFinal[]>{
    return this.http.get(this.urlEndPoint+"/director/"+cedula,{headers: this.httpHeaders}).pipe(map(Response => Response as InformeFinal[]))
  }
  getInforme_porCV(cedula:String):Observable<InformeFinal[]>{
    return this.http.get(this.urlEndPoint+"/cv/"+cedula,{headers: this.httpHeaders}).pipe(map(Response => Response as InformeFinal[]))
  }

  deleteAnexo(id?: Number){
    return this.http.delete<InformeFinal>(this.urlEndPoint+'/'+id,{headers: this.httpHeaders})
  }
}

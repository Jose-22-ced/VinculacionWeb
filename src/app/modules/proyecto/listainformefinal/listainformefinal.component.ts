import { Component, OnInit } from '@angular/core';

// @ts-ignore
import { saveAs } from "file-saver";
import {Proyectos} from "../../../models/proyectos";
import Swal from "sweetalert2";
import {UntypedFormBuilder, UntypedFormControl} from "@angular/forms";
import {map, Observable, startWith} from "rxjs";
import {InformeFinal} from "../../../models/final";
import {ActivatedRoute, Router} from "@angular/router";
import {ProyectoService} from "../../../services/proyecto.service";
import {DateAdapter} from "@angular/material/core";
import {InformeFinalService} from "../../../services/informefinal.service";
function getBase64(file: any) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}
@Component({
  selector: 'app-listainformefinal',
  templateUrl: './listainformefinal.component.html',
  styleUrls: ['./listainformefinal.component.css']
})
export class ListainformefinalComponent implements OnInit {
  issloading=true;
  isexist?:boolean;
  panelOpenState = false;
  cedulaa?:String;
  nombress?:String;
  informeS:InformeFinal[]=[];
  myControl = new UntypedFormControl();
  filteredOptions?: Observable<InformeFinal[]>;

  constructor(private router:Router,
  private activatedRoute: ActivatedRoute,
  private proyectoService: ProyectoService,
  private _formBuilder: UntypedFormBuilder,
  private _adapter: DateAdapter<any>,
  private informeService:InformeFinalService) { }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params=>{
      let cedula = params['cedula']
      let nombres= params['nombres']
      this.cedulaa=cedula
      this.nombress=nombres
      this.informeService.getInforme_porDirector(cedula).subscribe(value=>{
        this.isexist=value.length!=0;
        this.informeS=value;
        //console.log(value)
        this.filteredOptions=this.myControl.valueChanges.pipe(
          startWith(''),
          map(values=>this.filter(values)),
        );
        this.issloading=false;
        //console.log(value)
      })
    })
  }

  filter(value: any): InformeFinal[] {
    const filterValue = value.toLowerCase();
    return this.informeS.filter(option => option.nombreProyecto?.toLowerCase().includes(filterValue)
      ||option.nombreDirector?.toLocaleLowerCase().includes(filterValue)
      ||option.nombreCoordinadorVinculacion?.toLocaleLowerCase().includes(filterValue)


    );
  }

  convertFile(docum:any) {
    //console.log(docum)
    //Usage example:
    var file = this.dataURLtoFile(docum, 'InformeFinal.pdf');
    //console.log(file);
    saveAs(file, 'InformeFinal.pdf');
  }

  dataURLtoFile(dataurl:any, filename:any) {
    let arr = dataurl.split(','),
      mime = arr[0].match(/:(.*?);/)[1],
      bstr = atob(arr[1]),
      n = bstr.length,
      u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
  }

  eliminar(informe: InformeFinal){
    this.issloading=true;
    //console.log(informe.id)
    this.informeService.deleteAnexo(informe.id).subscribe(value => {
      Swal.fire({
        title: 'Exito',
        text: 'Informe final eliminado',
        icon: 'success',
        iconColor: '#17550c',
        color: "#0c3255",
        confirmButtonColor: "#0c3255",
        background: "#fbc02d",
      })
      window.location.reload();
      this.issloading = false;
    }, error => {
      Swal.fire({
        title: 'Error',
        text: 'Informe Final no se elimino ' + error.error.messages,
        icon: 'error',
        color: "#0c3255",
        confirmButtonColor: "#0c3255",
        background: "#fbc02d",
      })
      this.issloading = false;
    })
  }
}

import { Component, OnInit } from '@angular/core';

import {UntypedFormBuilder, UntypedFormControl} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {FechaService} from "../../../services/fecha.service";
import {ProyectoService} from "../../../services/proyecto.service";
import {ResponsablepppService} from "../../../services/responsableppp.service";
import {EntidadbeneficiarioService} from "../../../services/entidadbeneficiario.service";
import {DateAdapter} from "@angular/material/core";
import {Anexo2Service} from "../../../services/anexo2.service";
import {Anexo3Service} from "../../../services/anexo3.service";
import {Anexo4Service} from "../../../services/anexo4.service";
import {CordinadorvinculacionService} from "../../../services/cordinadorvinculacion.service";
import {InformedeaceptacionestdiatesService} from "../../../services/informedeaceptacionestdiates.service";
import {map, Observable, startWith} from "rxjs";
import {Proyectos} from "../../../models/proyectos";
// @ts-ignore
import { saveAs } from "file-saver";
import Swal from "sweetalert2";
import {Anexo13} from "../../../models/anexo13";
// @ts-ignore
import PizZipUtils from "pizzip/utils";
import {Informeaceptacion} from "../../../models/informeaceptacion";
function loadFile(url:any, callback:any) {
  PizZipUtils.getBinaryContent(url, callback);
}
function getBase64(file: any) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}

@Component({
  selector: 'app-firmarinformeaceptacionestudiantes',
  templateUrl: './firmarinformeaceptacionestudiantes.component.html',
  styleUrls: ['./firmarinformeaceptacionestudiantes.component.css']
})
export class FirmarinformeaceptacionestudiantesComponent implements OnInit {

  myControl = new UntypedFormControl();
  filteredOptions?: Observable<Informeaceptacion[]>;
  issloading=true;
  informeAceotacion:Informeaceptacion[] = [];
  constructor(private _formBuilder: UntypedFormBuilder,
              private router: Router,
              private fechaService:FechaService,
              private activatedRoute: ActivatedRoute,
              private proyectoService:ProyectoService,
              private responsablepppService:ResponsablepppService,
              private entidadbeneficiarioService:EntidadbeneficiarioService,
              private _adapter: DateAdapter<any>,
              private anexo2Service:Anexo2Service,
              private anexo3Service:Anexo3Service,
              private anexo4Service:Anexo4Service,
              private cordinadorvinculacionService:CordinadorvinculacionService,
              private informedeaceptacionestdiatesService:InformedeaceptacionestdiatesService) {
    this._adapter.setLocale('es-ec');
  }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe( params => {
      let nombre = params['nombres']
      this.informedeaceptacionestdiatesService.getAll().forEach(value => {
        this.informeAceotacion=value.filter(value1 => value1.nombreRevisado==nombre)
        //console.log(value)
        this.issloading=false;
        this.filteredOptions = this.myControl.valueChanges.pipe(
          startWith(''),
          map(values=>this.filter(values)),
        );
      })
    })
  }
  filter(value: any): Informeaceptacion[] {
    const filterValue = value.toLowerCase();
    return this.informeAceotacion.filter(option => option.nombreRevisado?.toLowerCase().includes(filterValue)
      ||option.nombreElaborado?.toLocaleLowerCase().includes(filterValue)
      ||option.nombreCarrera?.toLocaleLowerCase().includes(filterValue)
      ||option.nombreProyecto?.toLocaleLowerCase().includes(filterValue)
    );
  }

  convertFile(docum:any) {
    //console.log(docum)
    //Usage example:
    var file = this.dataURLtoFile(docum, 'Anexo13.pdf');
    // console.log(file);
    saveAs(file, 'Anexo2.pdf');
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
  subiranexo(informeaceptacion:Informeaceptacion){
    Swal.fire({
      allowOutsideClick: false,
      allowEnterKey:false,
      allowEscapeKey:false,
      showCancelButton: true,
      confirmButtonText:"ENVIAR ANEXO FIRMADO 👉",
      color: "#0c3255",
      confirmButtonColor: "#3cb227",
      background: "#fbc02d",
      title: 'Confirmación',
      text: 'Debe subir la el anexo en el formato anterirmente requerido "PDF" para finalizar. Nota: Sea reponsable con el documento a subir, para evitar problemas futuros.',
      input: 'file',
      inputAttributes: {
        'accept': 'application/pdf',
        'aria-label': 'Debe subir la convocatoria en formato PDF'
      },
      inputValidator: (value) => {
        return new Promise((resolve) => {
          if (value === null) {
            resolve('Es necesario que seleccione el PDF del anexo')
          } else {
            getBase64(value).then(docx => {
              informeaceptacion.documento = docx + '';
              this.informedeaceptacionestdiatesService.updatepreinforme(informeaceptacion).subscribe(value1 => {
                Swal.fire({
                  title: 'Exito',
                  text: 'El anexo se subio correctamente',
                  icon: 'success',
                  iconColor :'#17550c',
                  color: "#0c3255",
                  confirmButtonColor:"#0c3255",
                  background: "#fbc02d",
                })
              },error => {
                Swal.fire({
                  title: 'Error',
                  text: 'Huba algun error',
                  icon: 'warning',
                  iconColor :'#17550c',
                  color: "#0c3255",
                  confirmButtonColor:"#0c3255",
                  background: "#fbc02d",
                })
              })
            })
          }
        })
      }
    })
  }

}

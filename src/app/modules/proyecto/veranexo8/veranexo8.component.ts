import { Component, OnInit } from '@angular/core';
import {UntypedFormBuilder, UntypedFormControl} from "@angular/forms";
import {map, Observable, startWith} from "rxjs";
import {FechaService} from "../../../services/fecha.service";
import {ActivatedRoute, Router} from "@angular/router";
import {DateAdapter} from "@angular/material/core";
import Swal from "sweetalert2";
import {Anexo8Service} from "../../../services/anexo8.service";
import {Anexo8} from "../../../models/anexo8";
// @ts-ignore
import { saveAs } from "file-saver";
import {Anexo61} from "../../../models/anexo61";
function getBase64(file: any) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}

@Component({
  selector: 'app-veranexo8',
  templateUrl: './veranexo8.component.html',
  styleUrls: ['./veranexo8.component.css']
})
export class Veranexo8Component implements OnInit {
  issloading=true;
  isexist?:boolean;
  panelOpenState = false;
  anexo8:Anexo8[]=[];
  myControl = new UntypedFormControl();
  filteredOptions?: Observable<Anexo8[]>;


  constructor(private router: Router, private fechaService:FechaService, private activatedRoute: ActivatedRoute,
            private _formBuilder: UntypedFormBuilder, private _adapter: DateAdapter<any>,
              private anexo8Service:Anexo8Service) {
    this._adapter.setLocale('es-ec');
  }
  ngOnInit(): void {
    this.activatedRoute.params.subscribe( params => {
      let cedula = params['cedula'];
        let nombres = params['nombres'];
      this.anexo8Service.getAll().subscribe(value => {

        ////director
        this.anexo8=value.filter(value=> value.cedulaDirector==cedula);
        this.anexo8=value.filter(value2=> value2.nombreDirectorProyecto==nombres);

        ///docente apoyo
        // this.anexo8=value.filter(value3=> value3.nombreDocenteApoyo==nombres);
        this.isexist=value.length!=0;


        this.filteredOptions = this.myControl.valueChanges.pipe(
          startWith(''),
          map(values=>this.filter(values)),
        );
        this.issloading=false;
        //console.log(value)
      })
    })
  }

  filter(value: any): Anexo8[] {
    const filterValue = value.toLowerCase();
    return this.anexo8.filter(option => option.cedulaDirector?.toLowerCase().includes(filterValue)
      ||option.nombreEstudiante?.toLocaleLowerCase().includes(filterValue)
      ||option.cedulaEstudiante?.toLocaleLowerCase().includes(filterValue)
      ||option.nombreDocenteApoyo?.toLocaleLowerCase().includes(filterValue)
    );
  }

  async update(anexo8: Anexo8) {
    const {value: file} = await Swal.fire({
      allowOutsideClick: false,
      title: 'SELECCIONE EL PDF',
      text: 'Debe subir el documento firmado en formato PDF',
      input: 'file',
      color: "#0c3255",
      confirmButtonColor:"#0c3255",
      background: "#fbc02d",
      inputAttributes: {
        'accept': 'application/pdf',
        'aria-label': 'SUBIR PDF FIRMADO'
      },
      inputValidator: (value) => {
        return new Promise((resolve) => {
          if (value === null) {
            resolve('Es necesario que seleccione el PDF')
          } else {
            getBase64(value).then(docx => {
              anexo8.documento = docx + '';
              this.anexo8Service.updateActivadades(anexo8).subscribe(value1 => {
                Swal.fire({
                  title: 'Exito',
                  text: 'El documento ha sido enviado con exito',
                  icon: 'success',
                  iconColor :'#17550c',
                  color: "#0c3255",
                  confirmButtonColor:"#0c3255",
                  background: "#fbc02d",
                })
              },error => {
                Swal.fire({
                  title: 'Error',
                  text: 'No se firmo el documento. '+error.error.message,
                  icon: 'warning',
                  color: "#0c3255",
                  confirmButtonColor:"#0c3255",
                  background: "#fbc02d",
                })
              })
              console.log(anexo8)
            })
          }
        })
      }
    })

  }

  //convert a pdf
  convertFile(docum:any) {
    // console.log(docum)
    //Usage example:
    var file = this.dataURLtoFile(docum, 'Anexo8.pdf');
    // console.log(file);
    saveAs(file, 'Anexo8.pdf');
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
}

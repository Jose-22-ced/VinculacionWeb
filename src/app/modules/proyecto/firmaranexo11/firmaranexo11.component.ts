import { Component, OnInit } from '@angular/core';

import {Anexo61} from "../../../models/anexo61";
import {FormBuilder, FormControl} from "@angular/forms";
import {map, Observable, startWith} from "rxjs";
import {ActivatedRoute, Router} from "@angular/router";
import {FechaService} from "../../../services/fecha.service";
import {ProyectoService} from "../../../services/proyecto.service";
import {DateAdapter} from "@angular/material/core";
import {Anexo11} from "../../../models/anexo11";
import {Anexo11Service} from "../../../services/anexo11.service";
// @ts-ignore
import { saveAs } from "file-saver";
import Swal from "sweetalert2";
function getBase64(file: any) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}

@Component({
  selector: 'app-firmaranexo11',
  templateUrl: './firmaranexo11.component.html',
  styleUrls: ['./firmaranexo11.component.css']
})
export class Firmaranexo11Component implements OnInit {

  issloading=true;
  isexist?:boolean;
  panelOpenState = false;

  anexo11:Anexo11[]=[];
  myControl = new FormControl();
  filteredOptions?: Observable<Anexo11[]>;
  cedula?: String;
  nombres?: String;

  constructor(private router: Router, private fechaService:FechaService, private activatedRoute: ActivatedRoute,
              private proyectoService:ProyectoService, private _formBuilder: FormBuilder,
              private _adapter: DateAdapter<any>,
              private anexo11Service:Anexo11Service) {
    this._adapter.setLocale('es-ec');
  }
  ngOnInit(): void {
    this.activatedRoute.params.subscribe( params => {
      let cedula = params['cedula']
      let nombres=params['nombres']
      this.nombres=nombres;
      this.cedula=cedula
      this.anexo11Service.getAll().subscribe(value => {
        this.anexo11 = value.filter(value => value.nombreDirector==nombres);

        //console.log(value);
        this.isexist=value.length!=0;
        this.anexo11=value;
        this.filteredOptions = this.myControl.valueChanges.pipe(
          startWith(''),
          map(values=>this.filter(values)),
        );
        this.issloading=false;
        //console.log(value)
      })
    })
  }

  filter(value: any): Anexo11[] {
    const filterValue = value.toLowerCase();
    return this.anexo11.filter(option => option.nombreApoyo?.toLowerCase().includes(filterValue)
      ||option.nombreDirector?.toLocaleLowerCase().includes(filterValue)
      ||option.nombresEstudiante?.toLocaleLowerCase().includes(filterValue)
      || option.carrera?.toLocaleLowerCase().includes(filterValue)
      || option.cedulaEstudiante?.toLocaleLowerCase().includes(filterValue)
    );
  }

  async update(anexo11: Anexo11) {
    const {value: file} = await Swal.fire({
      allowOutsideClick: false,
      title: 'SELECCIONE EL PDF',
      text: 'Debe subir la covocataria en tipo PDF',
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
              anexo11.documento = docx + '';
              this.anexo11Service.updateanexo11(anexo11).subscribe(value1 => {
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
              // console.log(anexo11)
            })
          }
        })
      }
    })

  }
  eliminarAnexo11(anexo11: Anexo11) {
    this.issloading = true;
    this.anexo11Service.deleteAnexo11(anexo11.id).subscribe(value => {
      Swal.fire({
        title: 'Exito',
        text: 'Anexo 11 eliminado',
        icon: 'success',
        iconColor: '#17550c',
        color: "#0c3255",
        confirmButtonColor: "#0c3255",
        background: "#fbc02d",
      })
      window.location.reload();
    }, error => {
      Swal.fire({
        title: 'Error',
        text: 'Anexo no se elimino ' + error.error.messages,
        icon: 'error',
        color: "#0c3255",
        confirmButtonColor: "#0c3255",
        background: "#fbc02d",
      })
      window.location.reload();
    })
    this.issloading = false;
  }
  //convert a pdf
  convertFile(docum:any) {
    //console.log(docum)
    //Usage example:
    var file = this.dataURLtoFile(docum, 'Anexo11.pdf');
    // console.log(file);
    saveAs(file, 'Anexo11.pdf');
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

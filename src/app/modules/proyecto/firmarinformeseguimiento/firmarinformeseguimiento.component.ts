import { Component, OnInit } from '@angular/core';

// @ts-ignore
import { saveAs } from "file-saver";
import {InformeSeguimiento} from "../../../models/seguimiento";
import {FormBuilder, FormControl} from "@angular/forms";
import {map, Observable, startWith} from "rxjs";
import {ActivatedRoute, Router} from "@angular/router";
import {ProyectoService} from "../../../services/proyecto.service";
import {DateAdapter} from "@angular/material/core";
import {InformeSeguimientoService} from "../../../services/informeseguimiento.service";
import {Anexo9} from "../../../models/anexo9";
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
  selector: 'app-firmarinformeseguimiento',
  templateUrl: './firmarinformeseguimiento.component.html',
  styleUrls: ['./firmarinformeseguimiento.component.css']
})
export class FirmarinformeseguimientoComponent implements OnInit {
  issloading=true;
  isexist?:boolean;
  panelOpenState = false;

  informeS:InformeSeguimiento[]=[];
  myControl = new FormControl();
  filteredOptions?: Observable<InformeSeguimiento[]>;

  constructor(private router:Router,
              private activatedRoute: ActivatedRoute,
              private proyectoService: ProyectoService,
              private _formBuilder: FormBuilder,
              private _adapter: DateAdapter<any>,
              private informeService:InformeSeguimientoService) { }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params=>{
      let cedula = params['cedula']
      let nombres= params['nombres']
      this.informeService.getInforme_porCV(cedula).subscribe(value=>{
        this.isexist=value.length!=0;
        this.informeS=value;
        // console.log(value)
        this.filteredOptions=this.myControl.valueChanges.pipe(
          startWith(''),
          map(values=>this.filter(values)),
        );
        this.issloading=false;
        // console.log(value)
      })
    })
  }

  filter(value: any): InformeSeguimiento[] {
    const filterValue = value.toLowerCase();
    return this.informeS.filter(option => option.nombreProyecto?.toLowerCase().includes(filterValue)
      ||option.nombreDirector?.toLocaleLowerCase().includes(filterValue)
      ||option.nombreCoordinadorVinculacion?.toLocaleLowerCase().includes(filterValue)
    );
  }

  async update(informe: InformeSeguimiento) {
    const {value: file} = await Swal.fire({
      allowOutsideClick: false,
      title: 'SELECCIONE EL PDF',
      text: 'Debe subir el informe en tipo PDF',
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
              informe.documento = docx + '';
              this.informeService.updateAnexo(informe).subscribe(value1 => {
                Swal.fire({
                  title: 'Exito',
                  text: 'El documneto ha sido enviado con exito',
                  icon: 'success',
                  iconColor :'#17550c',
                  color: "#0c3255",
                  confirmButtonColor:"#0c3255",
                  background: "#fbc02d",
                })
              },error => {
                Swal.fire({
                  title: 'Error',
                  text: 'No se firmo el docuemnto. '+error.error.message,
                  icon: 'warning',
                  color: "#0c3255",
                  confirmButtonColor:"#0c3255",
                  background: "#fbc02d",
                })
              })
              //console.log(informe)
            })
          }
        })
      }
    })

  }
  convertFile(docum:any) {
    //console.log(docum)
    //Usage example:
    var file = this.dataURLtoFile(docum, 'InformeSeguimiento.pdf');
    //console.log(file);
    saveAs(file, 'InformeSeguimiento.pdf');
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

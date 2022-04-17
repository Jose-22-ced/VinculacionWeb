import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {FechaService} from "../../../services/fecha.service";
import {ProyectoService} from "../../../services/proyecto.service";
import {ResponsablepppService} from "../../../services/responsableppp.service";
import {FormBuilder, FormControl} from "@angular/forms";
import {EntidadbeneficiarioService} from "../../../services/entidadbeneficiario.service";
import {DateAdapter} from "@angular/material/core";
import {Anexo2Service} from "../../../services/anexo2.service";
import {Anexo3Service} from "../../../services/anexo3.service";
import {Anexo4Service} from "../../../services/anexo4.service";
import {Anexo4} from "../../../models/anexo4";
import {map, Observable, startWith} from "rxjs";
import {Anexo3} from "../../../models/anexo3";
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
  selector: 'app-firmarpostulacion',
  templateUrl: './firmarpostulacion.component.html',
  styleUrls: ['./firmarpostulacion.component.css']
})
export class FirmarpostulacionComponent implements OnInit {
  issloading=true;
  isexist?:boolean


  anexo4:Anexo4[]=[];
  myControl = new FormControl();
  filteredOptions?: Observable<Anexo4[]>;

  constructor(private router: Router,
              private fechaService:FechaService,
              private activatedRoute: ActivatedRoute,
              private proyectoService:ProyectoService,
              private responsablepppService:ResponsablepppService,
              private _formBuilder: FormBuilder,
              private entidadbeneficiarioService:EntidadbeneficiarioService,
              private _adapter: DateAdapter<any>,
              private anexo2Service:Anexo2Service,
              private anexo3Service:Anexo3Service,
              private anexo4Service:Anexo4Service) {
    this._adapter.setLocale('es-ec');
  }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe( params => {
      let cedula = params['cedula']
      this.anexo4Service.getAnexo4byCedula(cedula).subscribe(value => {
        this.isexist=value.length!=0;
        this.anexo4=value;
        this.issloading=false;
        this.filteredOptions = this.myControl.valueChanges.pipe(
          startWith(''),
          map(values=>this.filter(values)),
        );
      })
    })
  }
  filter(value: any): Anexo4[] {
    console.log(value)
    const filterValue = value.toLowerCase();
    return this.anexo4.filter(option => option.nombreProyecto?.toLowerCase().includes(filterValue)
      ||option.cedulaDirector?.toLocaleLowerCase().includes(filterValue)
      ||option.nombreEstudiante?.toLocaleLowerCase().includes(filterValue)
      ||option.cedulaEstudiante?.toLocaleLowerCase().includes(filterValue)
      ||option.numeroHoras?.toLocaleLowerCase().includes(filterValue)
    );
  }


  firmarAceptacion(anexo4:Anexo4){
    if(anexo4.num_proceso==2){
      Swal.fire({
        title: 'Finalizado',
        text: 'Se ha finalizado el proceso de aceptación',
        icon: 'success',
        iconColor :'#17550c',
        color: "#0c3255",
        confirmButtonColor:"#0c3255",
        background: "#fbc02d",
      })
    }else {
      Swal.fire({
        allowOutsideClick: false,
        allowEnterKey:false,
        allowEscapeKey:false,
        title: '¡ATENCIÓN!',
        text: '🔊 Antes de "CONTINUAR LA ACEPTACIÓN" usted deberá: ' +
          '1. Obtener el anexo\n' +
          '2. Firmar el anexo y trasnformarlo a PDF '+
          '3. Dar clic en "Continuar Postulación"',
        icon: 'info',
        showDenyButton: true,
        showCancelButton: true,
        cancelButtonText: 'Salir, y continuar después',
        confirmButtonText: '📑OBTENER ANEXO',
        denyButtonText: `CONTINUAR ACEPTACIÓN 👉`,
        denyButtonColor: "#3cb227",
        color: "#0c3255",
        confirmButtonColor: "#0c3255",
        background: "#fbc02d",
      }).then(async (result) => {
        /* Read more about isConfirmed, isDenied below */
        if (result.isConfirmed) {
          this.convertFile(anexo4.documento);
        } else if (result.isDenied) {
          const {value: file} = await Swal.fire({
            allowOutsideClick: false,
            allowEnterKey:false,
            allowEscapeKey:false,
            showCancelButton: true,
            confirmButtonText:"ENVIAR ACEPTACIÓN",
            color: "#0c3255",
            confirmButtonColor: "#3cb227",
            background: "#fbc02d",
            title: 'Confirmación',
            text: 'Debe subir el anexo en el formato requerido "PDF" para finalizar. Nota: Sea reponsable con el documento a subir.',
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
                    anexo4.documento=docx+"";
                    anexo4.num_proceso=2;
                    this.anexo4Service.updateAnexo4(anexo4).subscribe(value1 => {
                      Swal.fire({
                        title: 'Éxito',
                        text: 'Ha finalizado el proceso de aceptación',
                        icon: 'success',
                        iconColor :'#17550c',
                        color: "#0c3255",
                        confirmButtonColor:"#0c3255",
                        background: "#fbc02d",
                      })
                    },error => {
                      Swal.fire({
                        title: 'Ha surgido un error',
                        text: "Hubo un error, contáctese con TICs.",
                        icon: 'error',
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
      })
    }

  }


  convertFile(docum:any) {
    console.log(docum)
    //Usage example:
    var file = this.dataURLtoFile(docum, 'Anexo4.pdf');
    console.log(file);
    saveAs(file, 'Anexo4.pdf');
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

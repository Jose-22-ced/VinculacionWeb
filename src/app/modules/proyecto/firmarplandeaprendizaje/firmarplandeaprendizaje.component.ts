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
import {Anexo1Service} from "../../../services/anexo1.service";
import {Anexo5Service} from "../../../services/anexo5.service";
import {MateriasService} from "../../../services/materias.service";
import {CordinadorvinculacionService} from "../../../services/cordinadorvinculacion.service";
import {Anexo6Service} from "../../../services/anexo6.service";
import {Anexo6} from "../../../models/anexo6";
import {map, Observable, startWith} from "rxjs";
import {Proyectos} from "../../../models/proyectos";
import {Anexo10} from "../../../models/anexo10";
import Swal from "sweetalert2";
// @ts-ignore
import { saveAs } from "file-saver";
import {Anexo13} from "../../../models/anexo13";
// @ts-ignore
import PizZipUtils from "pizzip/utils";

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
  selector: 'app-firmarplandeaprendizaje',
  templateUrl: './firmarplandeaprendizaje.component.html',
  styleUrls: ['./firmarplandeaprendizaje.component.css']
})
export class FirmarplandeaprendizajeComponent implements OnInit {



  issloading=true;
  isexist?:boolean
  myControl = new FormControl();
  filteredOptions?: Observable<Anexo6[]>;
  anexo6:Anexo6[]=[];
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
              private anexo4Service:Anexo4Service,
              private anexo1Service:Anexo1Service,
              private anexo5Service:Anexo5Service,
              private materiasService:MateriasService,
              private cordinadorvinculacionService:CordinadorvinculacionService,
              private anexo6Service:Anexo6Service) { }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe( params => {
      let cedula = params['cedula']
      this.responsablepppService.getResposablepppbyAll().subscribe(value => {
        this.anexo6Service.getanexo6byvinculacion(cedula).subscribe(value1 => {
          this.isexist=value1.length!=0;
          this.anexo6=value1;
          this.filteredOptions = this.myControl.valueChanges.pipe(
            startWith(''),
            map(values=>this.filter(values)),
          );
          this.issloading=false;
        })
      })
    })
  }

  filter(value: any): Anexo6[] {
    const filterValue = value.toLowerCase();
    return this.anexo6.filter(option => option.cedulaEstudiante?.toLowerCase().includes(filterValue)
      ||option.nombreEstudiante?.toLocaleLowerCase().includes(filterValue)
      ||option.nombreProyecto?.toLocaleLowerCase().includes(filterValue)
      ||option.ciclo?.toLocaleLowerCase().includes(filterValue)
      ||option.nombreEntidad?.toLocaleLowerCase().includes(filterValue)
    );
  }

  subiranexo(anexo6:Anexo6){
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
              anexo6.documento = docx + '';
              anexo6.num_proceso=2;
              this.anexo6Service.updateAnexo6(anexo6).subscribe(value1 => {
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

  convertFile(docum:any) {
    console.log(docum)
    //Usage example:
    var file = this.dataURLtoFile(docum, 'Anexo6.pdf');
    console.log(file);
    saveAs(file, 'Anexo6.pdf');
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

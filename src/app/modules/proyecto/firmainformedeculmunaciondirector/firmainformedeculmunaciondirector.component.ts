import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormControl} from "@angular/forms";
import {map, Observable, startWith} from "rxjs";
import {Anexo10} from "../../../models/anexo10";
import {ActivatedRoute, Router} from "@angular/router";
import {Anexo4Service} from "../../../services/anexo4.service";
import {ProyectoService} from "../../../services/proyecto.service";
import {Anexo10Service} from "../../../services/anexo10.service";
import {Anexo8Service} from "../../../services/anexo8.service";
import {Anexo5Service} from "../../../services/anexo5.service";
import {Anexo2Service} from "../../../services/anexo2.service";
import {FechaService} from "../../../services/fecha.service";
import {Anexo1Service} from "../../../services/anexo1.service";
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
  selector: 'app-firmainformedeculmunaciondirector',
  templateUrl: './firmainformedeculmunaciondirector.component.html',
  styleUrls: ['./firmainformedeculmunaciondirector.component.css']
})
export class FirmainformedeculmunaciondirectorComponent implements OnInit {

  issloading=true;
  isexist?:boolean
  myControl = new FormControl();
  filteredOptions?: Observable<Anexo10[]>;
  date?:Date;
  anexo10:Anexo10[]=[];

  constructor(private _formBuilder: FormBuilder,
              private activatedRoute: ActivatedRoute,
              private anexo4Service:Anexo4Service,
              private proyectoService:ProyectoService,
              private anexo1Service:Anexo1Service,
              private anexo10Service:Anexo10Service,
              private anexo8Service:Anexo8Service,private anexo5Service:Anexo5Service, private anexo2Service:Anexo2Service,  private router: Router,private fb: FormBuilder,private fechaService:FechaService) { }


  ngOnInit(): void {
    this.activatedRoute.params.subscribe( params => {
      let cedula = params['cedula']
      this.anexo1Service.getAnexo1byCedula(cedula).subscribe(dir => {
        this.anexo10Service.getAnexo10All().subscribe(value => {
          // @ts-ignore
          this.isexist=value.filter(value1 => value1.idProyectoPPP==dir[0].idProyectoPPP&&value1.num_proceso>=2).length!=0;
          // @ts-ignore
          this.anexo10=value.filter(value1 => value1.idProyectoPPP==dir[0].idProyectoPPP&&value1.num_proceso>=2)
          this.fechaService.getSysdate().subscribe(value1 => this.date=value1.fecha)
          this.issloading=false;
          this.filteredOptions = this.myControl.valueChanges.pipe(
            startWith(''),
            map(values=>this.filter(values)),
          );
        })
      })
    })
  }

  filter(value: any): Anexo10[] {
    const filterValue = value.toLowerCase();
    return this.anexo10.filter(option => option.cedulaDocenteApoyo?.toLowerCase().includes(filterValue)
      ||option.nombreDirector?.toLocaleLowerCase().includes(filterValue)
      ||option.cedulaEstudiante?.toLocaleLowerCase().includes(filterValue)
      ||option.nombreEmpresa?.toLocaleLowerCase().includes(filterValue)
      ||option.nombreEstudiante?.toLocaleLowerCase().includes(filterValue)
      ||option.nombreProyecto?.toLocaleLowerCase().includes(filterValue)
    );
  }


  subiranexo(anexo10:Anexo10){
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
              anexo10.documento = docx + '';
              anexo10.num_proceso=3;
              this.anexo10Service.updateAnexo10(anexo10).subscribe(value1 => {
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
    var file = this.dataURLtoFile(docum, 'Anexo10.pdf');
    console.log(file);
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

}

import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormControl} from "@angular/forms";
import {map, Observable, startWith} from "rxjs";
import {FechaService} from "../../../services/fecha.service";
import {CarrerasService} from "../../../services/carreras.service";
import {ActivatedRoute, Router} from "@angular/router";
import {EntidadbeneficiarioService} from "../../../services/entidadbeneficiario.service";
import {DateAdapter} from "@angular/material/core";
import {Anexo7} from "../../../models/anexo7";
import {Anexo7Service} from "../../../services/anexo7.service";
// @ts-ignore
import { saveAs } from "file-saver";
import Swal from "sweetalert2";
import {Anexo3} from "../../../models/anexo3";
import {DatePipe} from "@angular/common";
import Docxtemplater from "docxtemplater";
// @ts-ignore
import PizZip from "pizzip";
// @ts-ignore
import PizZipUtils from "pizzip/utils/index.js";
// @ts-ignore
import { saveAs } from "file-saver";
import {Anexo3Service} from "../../../services/anexo3.service";
import {Anexo1Service} from "../../../services/anexo1.service";
import {Anexo13} from "../../../models/anexo13";

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
  selector: 'app-veranexos7',
  templateUrl: './veranexos7.component.html',
  styleUrls: ['./veranexos7.component.css']
})
export class Veranexos7Component implements OnInit {



  issloading = true;
  isexist?: boolean
  panelOpenState = false;
  myControl = new FormControl();
  filteredOptions?: Observable<Anexo7[]>;
  cedula?: String;
  nombres?: String;
  anexos7: Anexo7[] = [];
  anexos3:Anexo3[] = [];

  constructor(private fechaService: FechaService, private carrerasService: CarrerasService,
              private activatedRoute: ActivatedRoute, private _formBuilder: FormBuilder,
              private entidadbeneficiarioService: EntidadbeneficiarioService,
              private anexo7Service: Anexo7Service,
              private _adapter: DateAdapter<any>,
              private router: Router,
              private anexo3Service:Anexo3Service,
              private anexo1Service:Anexo1Service) {
    this._adapter.setLocale('es-ec');
  }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params => {
      let cedula = params['cedula']
      let nombres = params['nombres']
      this.cedula=cedula;
      this.nombres = nombres;
      console.log(cedula)
      this.anexo1Service.getAnexo1byCedula(cedula).subscribe(datos=>{
        this.anexo7Service.getAnexo7All().subscribe(anex7 => {
          this.anexos7 = anex7.filter(value => value.nombreDirectorProyecto==nombres);
          this.isexist = anex7.length != 0;
          this.anexo3Service.getAnexo3byProyecto(datos[0].idProyectoPPP).subscribe(value => {
            this.anexos3=value.filter(value1 => value1.estado=="AN");
            this.issloading = false;
          })
          this.filteredOptions = this.myControl.valueChanges.pipe(
            startWith(''),
            map(values => this.filter(values)),
          );
        })
      })
    })
  }
  ngAfterViewInit(): void {
    setTimeout(() => {
    }, 1000)
  }
  filter(value: any): Anexo7[] {
    const filterValue = value.toLowerCase();
    // @ts-ignore
    return this.anexos7.filter(option => option.fechaPlanificacion?.toLowerCase().includes(filterValue)
      || option.nombreDirectorProyecto?.toLocaleLowerCase().includes(filterValue)
      || option.nombreProyecto?.toLocaleLowerCase().includes(filterValue)
      || option.nombreEntidadBeneficiaria?.toLocaleLowerCase().includes(filterValue)
    );
  }



  eliminarAnexo7(anexo7: Anexo7) {
    this.issloading = true;
    this.anexo7Service.deleteAnexo7(anexo7.id).subscribe(value => {
      Swal.fire({
        title: 'Exito',
        text: 'Anexo 7 eliminado',
        icon: 'success',
        iconColor: '#17550c',
        color: "#0c3255",
        confirmButtonColor: "#0c3255",
        background: "#fbc02d",
      })
      this.issloading = false;
    }, error => {
      Swal.fire({
        title: 'Error',
        text: 'Anexo no se elimino ' + error.error.messages,
        icon: 'error',
        color: "#0c3255",
        confirmButtonColor: "#0c3255",
        background: "#fbc02d",
      })
      this.issloading = false;
    })
  }

  convertFile(docum: any) {
    console.log(docum)
    //Usage example:
    var file = this.dataURLtoFile(docum, 'Anexo7.pdf');
    console.log(file);
    saveAs(file, 'Anexo7.pdf');
  }

  dataURLtoFile(dataurl: any, filename: any) {
    let arr = dataurl.split(','),
      mime = arr[0].match(/:(.*?);/)[1],
      bstr = atob(arr[1]),
      n = bstr.length,
      u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, {type: mime});
  }


  subiranexo(anexo7:Anexo7){
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
              anexo7.documento = docx + '';
              this.anexo7Service.updateAnexo7(anexo7).subscribe(value1 => {
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
                  text: 'Hubo algun error',
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


  generarDocumento711(anexo7:Anexo7,anexo3:Anexo3[]) {
    console.log(anexo7)
    var pipe:DatePipe = new DatePipe('en-US')
    loadFile("https://raw.githubusercontent.com/Jose-22-ced/VinculacionWeb/master/src/assets/docs/anexo7.docx", function(
      // @ts-ignore
      error,
      // @ts-ignore
      content
    ) {
      if (error) {
        throw error;
      }
      const zip = new PizZip(content);
      const doc = new Docxtemplater(zip, { paragraphLoop: true, linebreaks: true });


      doc.setData({
//
        fecha_realizacion:pipe.transform(anexo7.fechaPlanificacion,'dd/MM/yyyy'),
        tb:anexo7.horasDocentes,
        tb2:anexo7.horasEstudiantes,
        mes_anio:pipe.transform(anexo7.mesAnioPlanificado,'MMMM/yyyy'),
        nombre_director:anexo7.nombreDirectorProyecto,
        nombre_proyecto:anexo7.nombreProyecto,
        entidad_beneficiaria:anexo7.nombreEntidadBeneficiaria,
        es:anexo3
      });
      try {
        // render the document (replace all occurences of {first_name} by John, {last_name} by Doe, ...)
        doc.render();
      } catch (error) {
        // The error thrown here contains additional information when logged with JSON.stringify (it contains a properties object containing all suberrors).
        // @ts-ignore
        function replaceErrors(key, value) {
          if (value instanceof Error) {
            return Object.getOwnPropertyNames(value).reduce(function(
                error,
                key
              ) {
                // @ts-ignore
                error[key] = value[key];
                return error;
              },
              {});
          }
          return value;
        }
        console.log(JSON.stringify({ error: error }, replaceErrors));
        // @ts-ignore
        if (error.properties && error.properties.errors instanceof Array) {
          // @ts-ignore
          const errorMessages = error.properties.errors
            // @ts-ignore
            .map(function(error) {
              return error.properties.explanation;
            })
            .join("\n");
          console.log("errorMessages", errorMessages);
          // errorMessages is a humanly readable message looking like this :
          // 'The tag beginning with "foobar" is unopened'
        }
        throw error;
      }
      const out = doc.getZip().generate({
        type: "blob",
        mimeType:
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
      });
      // Output the document using Data-URI
      saveAs(out, "Anexo7.docx");
    });
  }

}


import { Component, OnInit } from '@angular/core';



// @ts-ignore
  import PizZip from "pizzip";
// @ts-ignore
import PizZipUtils from "pizzip/utils/index.js";
// @ts-ignore
import { saveAs } from "file-saver";
import {FormArray, FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {User} from "../../../models/user";
import {Anexo8} from "../../../models/anexo8";
import {Proyectos} from "../../../models/proyectos";
import {Anexo11, Anexo11DirectorResponse} from "../../../models/anexo11";
import {Observable} from "rxjs";
import {IniciosesionService} from "../../../services/iniciosesion.service";
import {ProyectoService} from "../../../services/proyecto.service";
import {FechaService} from "../../../services/fecha.service";
import {DateAdapter} from "@angular/material/core";
import {Anexo11Service} from "../../../services/anexo11.service";
import {Anexo8Service} from "../../../services/anexo8.service";
import {ActivatedRoute} from "@angular/router";
import Swal from "sweetalert2";
import {DatePipe} from "@angular/common";
import Docxtemplater from "docxtemplater";
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
  selector: 'app-editaranexo11director',
  templateUrl: './editaranexo11director.component.html',
  styleUrls: ['./editaranexo11director.component.css']
})
export class Editaranexo11directorComponent implements OnInit {


  activar?: boolean = false;
  sum = 0;
  numerominimo = 0;
  id11?: Number;
  isLinear = true;
  panelOpenState = true;
  issloading = true;
  isexist?: boolean;
  myControl = new FormControl();
  cedula?: String;
  nombres?: String;
  fechai?: Date;
  fechaf?: Date;
  fechae?: Date;
  puntajea?: Number;
  resultadoAnexo11?: String;
  fourFormGroup?:FormGroup;
  user: User = new User();
  anexo8: Anexo8 = new Anexo8();
  anexo8select: Anexo8[] = []
  anexo11select: Anexo11 = new Anexo11();
  proyectoselect: Proyectos = new Proyectos();
  filteredOptions?: Observable<Anexo11[]>;
  thirdFormGroup?: FormGroup;
  numero?: Number;
  rows: FormArray;
  itemForm?: FormGroup;
  apoyoItem1?: String

  constructor(private activatedRoute: ActivatedRoute,
              private _formBuilder: FormBuilder,
              private usarioService: IniciosesionService,
              private proyectoService: ProyectoService,
              private fechaService: FechaService,
              private _adapter: DateAdapter<any>,
              private anexo11Service: Anexo11Service,
              private anexo8Service: Anexo8Service,
  ) {
    this._adapter.setLocale('es-ec');
    this.thirdFormGroup = this._formBuilder.group({
      items: [null, Validators.required],
      items_value: ['no', Validators.required]
    });
    this.rows = this._formBuilder.array([]);


  }

  ngAfterViewInit(): void {
    setTimeout(() => {
    }, 1000)
  }


  ngOnInit(): void {

    this.activatedRoute.params.subscribe(params => {
      let id = params['id']
      console.log(id)
      let cedula = params['cedula']
      let nombres = params['nombres']
      this.nombres = nombres;
      this.anexo11Service.getAnexo11byid(id).subscribe(data => {
        this.anexo11select = data
        this.puntajea = this.anexo11select.apoyoPuntaje;
        console.log(this.anexo11select.apoyoPuntaje+ 'lllllll')
        this.anexo11select.director?.forEach(value1 => {
          this.onAddRow(value1);
        })

        console.log(data);
        this.issloading = false;
      })

      this.fechaService.getSysdate().subscribe(value => {
        this.fechae = value.fecha;
      })
    })

    this.thirdFormGroup = this._formBuilder.group({});
    this.fourFormGroup = this._formBuilder.group({
      docx: ['', Validators.required],
    });
    this.thirdFormGroup.get("items_value")?.setValue("yes");
    this.thirdFormGroup.addControl('rows', this.rows);
  }


  //Array
  onAddRow(director: Anexo11DirectorResponse) {
    this.sum = 0;
    this.rows.push(this.createItemFormGroup(director));
    this.rows.getRawValue().forEach(element => {
      this.sum += element.directorPuntaje;
      console.log(this.sum)
    })
    if (this.numerominimo - 1 >= this.sum) {
      this.activar = true;
    } else {
      this.activar = false;
    }
  }

  onRemoveRow(rowIndex: number) {
    this.sum = 0;
    this.rows.removeAt(rowIndex);
    this.rows.getRawValue().forEach(element => {
      this.sum += element.directorItem3;
      console.log(this.sum)
    })
    if (this.numerominimo - 1 >= this.sum) {
      this.activar = true;
    } else {
      this.activar = false;
    }
  }

  sumar() {
    this.sum = 0;
    this.rows.getRawValue().forEach(element => {
      this.sum += element.directorItem3;
      console.log(this.sum)
    })
    if (this.numerominimo - 1 >= this.sum) {
      this.activar = true;
    } else {
      this.activar = false;
    }
  }

  createItemFormGroup(director: Anexo11DirectorResponse): FormGroup {
    return this._formBuilder.group({
      id: [director.id],
      directorItem1: [director.directorItem1, Validators.required],
      directorItem2: [director.directorItem2, Validators.required],
      directorItem3: [director.directorItem3, Validators.required],
    });
  }

  anexo11ob: Anexo11 = new Anexo11();

  obtenerdatos() {
    console.log(this.rows.getRawValue())
    this.anexo11ob.id = this.anexo11select.id;
    // @ts-ignore
    this.anexo11ob.director?.length = 0;
    this.anexo11ob.director = this.rows.getRawValue();
    console.log(this.anexo11ob.director)
    this.anexo11ob.carrera = this.anexo11select.carrera;
    this.anexo11ob.idProyecto = this.anexo11select.idProyecto;
    this.anexo11ob.nombreApoyo = this.anexo11select.nombreApoyo;
    this.anexo11ob.nombresEstudiante = this.anexo11select.nombresEstudiante;
    this.anexo11ob.cedulaEstudiante = this.anexo11select.cedulaEstudiante;
    this.anexo11ob.emailEstudiante = this.anexo11select.emailEstudiante;
    this.anexo11ob.directorPuntaje = this.sum;
    this.anexo11ob.nombreDirector = this.anexo11select.nombreDirector;
    this.anexo11ob.fechaEvaluacion = this.fechae;
    this.anexo11ob.apoyo = this.anexo11select.apoyo;
    this.anexo11ob.fechaInicio = this.anexo11select.fechaInicio;
    this.anexo11ob.fechaFinaliza = this.anexo11select.fechaFinaliza;
    this.anexo11ob.apoyoPuntaje = this.anexo11select.apoyoPuntaje;
    this.anexo11ob.resultadoAnexo11=this.anexo11select.resultadoAnexo11;
    // @ts-ignore
    this.anexo11ob.promedio = (this.puntajea + this.anexo11ob.directorPuntaje) / 2
    this.anexo11ob.totalHoras = this.anexo11select.totalHoras;
    return this.anexo11ob

  }


  editar(anexo11: Anexo11) {
    anexo11 = this.obtenerdatos();

    anexo11.director = this.rows.getRawValue()
    anexo11.directorPuntaje = this.sum;
    // @ts-ignore
    this.anexo11Service.updateanexo11(anexo11).subscribe(datos => {
      console.log(anexo11, anexo11.id)
      Swal.fire({
        icon: 'success',
        title: 'ACTUALIZADO',
        text: 'Datos guadados correctamente',
        confirmButtonColor: "#0c3255",
        background: "#fbc02d",
      })
    }, err => {
      Swal.fire({
        icon: 'warning',
        title: 'Al paracer hubo un problema',
        text: err.error.message,
        confirmButtonColor: "#0c3255",
        background: "#fbc02d",
      })
    })

  }


  subirDocumento11(file: FileList) {
    if (file.length == 0) {
    } else {
      getBase64(file[0]).then(docx => {
        // @ts-ignore
        console.log(docx.length)
        // @ts-ignore
        if (docx.length >= 10485760) {
          this.anexo11ob.documento = "";
          Swal.fire(
            'Fallo',
            'El documento excede el peso permitido',
            'warning'
          )
        } else {
          this.anexo11ob.documento = docx + "";
        }
      })
    }
  }

  generarDocumento11() {
    var anexo11: Anexo11 = this.obtenerdatos();
    console.log(anexo11)
    var pipe: DatePipe = new DatePipe('en-US')
    loadFile("https://raw.githubusercontent.com/Jose-22-ced/VinculacionWeb/master/src/assets/docs/anexo11.docx", function (
      // @ts-ignore
      error,
      // @ts-ignore
      content
    ) {
      if (error) {
        throw error;
      }
      const zip = new PizZip(content);
      const doc = new Docxtemplater(zip, {paragraphLoop: true, linebreaks: true});


      doc.setData({
        fechaEvaluacion:pipe.transform(anexo11.fechaEvaluacion,'dd/MM/yyyy'),
        fechainicio:pipe.transform(anexo11.fechaInicio,'dd/MM/yyyy'),
        fechafinaliza:pipe.transform(anexo11.fechaFinaliza,'dd/MM/yyyy'),
        tb:anexo11.apoyo,
        tb2:anexo11.director,
        nombreDocenteApoyo:anexo11.nombreApoyo,
        puntaje1:anexo11.apoyoPuntaje,
        puntaje2:anexo11.directorPuntaje,
        nombreDirectoProyecto:anexo11.nombreDirector,
        nombreEstudiante:anexo11.nombresEstudiante,
        cedulaEs:anexo11.cedulaEstudiante,
        emailEst:anexo11.emailEstudiante,
        carrera:anexo11.carrera,
        numHoras:anexo11.totalHoras,
        apruebaSiNo:anexo11.resultadoAnexo11,
        promedio:anexo11.promedio,


      });
      try {
        // render the document (replace all occurences of {first_name} by John, {last_name} by Doe, ...)
        doc.render();
      } catch (error) {
        // The error thrown here contains additional information when logged with JSON.stringify (it contains a properties object containing all suberrors).
        // @ts-ignore
        function replaceErrors(key, value) {
          if (value instanceof Error) {
            return Object.getOwnPropertyNames(value).reduce(function (
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

        console.log(JSON.stringify({error: error}, replaceErrors));
        // @ts-ignore
        if (error.properties && error.properties.errors instanceof Array) {
          // @ts-ignore
          const errorMessages = error.properties.errors
            // @ts-ignore
            .map(function (error) {
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
      saveAs(out, "Anexo11.docx");
    });
  }

  refresh() {
    window.location.reload();
  }
}


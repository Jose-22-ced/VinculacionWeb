import { Component, OnInit } from '@angular/core';
import {FormArray, FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {User} from "../../../models/user";
import {Anexo6} from "../../../models/anexo6";
import {Proyectos} from "../../../models/proyectos";
import {map, Observable, startWith} from "rxjs";
import {ActivatedRoute} from "@angular/router";
import {Anexo6Service} from "../../../services/anexo6.service";
import {IniciosesionService} from "../../../services/iniciosesion.service";
import {ProyectoService} from "../../../services/proyecto.service";
import {FechaService} from "../../../services/fecha.service";
import {Anexo11Service} from "../../../services/anexo11.service";
import {MatSelectionListChange} from "@angular/material/list";
import {Anexo11, Anexo11ApoyoResponse, Anexo11DirectorResponse} from "../../../models/anexo11";
import Swal from "sweetalert2";
import {DateAdapter} from "@angular/material/core";
import {DatePipe} from "@angular/common";
import Docxtemplater from "docxtemplater";

// @ts-ignore
import PizZip from "pizzip";
// @ts-ignore
import PizZipUtils from "pizzip/utils/index.js";
// @ts-ignore
import { saveAs } from "file-saver";
import {Anexo61} from "../../../models/anexo61";

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
const resultado2 = [
  {item: '2.1' , instrumento: 'Adaptabilidad e Integración al sistema de trabajo de la Institución.  '},
  {item: '2.2' , instrumento: 'Demuestra capacidad de liderazgo y de trabajo en equipo '},
  {item: '2.3' , instrumento: 'Asiste puntualmente '},
  {item: '2.4' , instrumento: 'Capacidad de Trabajo en Equipo / Presión '}
]

@Component({
  selector: 'app-anexo11director',
  templateUrl: './anexo11director.component.html',
  styleUrls: ['./anexo11director.component.css']
})
export class Anexo11directorComponent implements OnInit {
  activar?:boolean=false;
  sum = 0;
  numerominimo=0;
  idpro?:Number;
  puntajea?:Number;
  isLinear = true;
  panelOpenState = true;
  issloading = true;
  fechae?:Date;
  isexist?: boolean;
  myControl = new FormControl();
  cedula?:String;
  nombres?:String;
  fecha?:Date;
  user: User=new User();
  anexo11: Anexo11[] = []
  anexo11select: Anexo11 = new Anexo11();
  proyectoselect: Proyectos = new Proyectos();
  filteredOptions?: Observable<Anexo11[]>;
  //secuenciasdepantallas
  firstFormGroup?: FormGroup;
  secondFormGroup?:FormGroup;
  thirdFormGroup?:FormGroup;
  fourFormGroup?:FormGroup;
  fiveFormGroup?:FormGroup;
  rows: FormArray;
  itemForm?: FormGroup;
  constructor(private activatedRoute: ActivatedRoute,
              private _formBuilder: FormBuilder,
              private anexo6Service: Anexo6Service,
              private usarioService: IniciosesionService,
              private proyectoService: ProyectoService,
              private fechaService: FechaService,
              private anexo11Service: Anexo11Service,
              private _adapter: DateAdapter<any>,
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

    this.activatedRoute.params.subscribe(params=>{
      let cedula = params['cedula']
      let nombres = params['nombres']
      this.nombres = nombres;
      this.anexo11Service.getAll().subscribe(data => {
        this.anexo11 = data.filter(value => value.nombreDirector==nombres);

        console.log(data);
        this.filteredOptions = this.myControl.valueChanges.pipe(
          startWith(''),
          map(values => this.filter(values)),
        );
        this.issloading = false;

      })
      this.fechaService.getSysdate().subscribe(value => {
        this.fecha = value.fecha;
      })
    })

    this.firstFormGroup = this._formBuilder.group({
      anexo6: ['', Validators.required]
    });
    this.secondFormGroup = this._formBuilder.group({
    });
    this.thirdFormGroup = this._formBuilder.group({
      resultadoAnexo11:['', Validators.required]
    });
    this.fiveFormGroup = this._formBuilder.group({
    });
    this.fourFormGroup = this._formBuilder.group({
      docx: ['', Validators.required],
    });
    this.thirdFormGroup.get("items_value")?.setValue("yes");
    this.thirdFormGroup.addControl('rows', this.rows);

  }
  filter(value: any): Anexo11[] {
    const filterValue = value.toString().toLowerCase();
    return this.anexo11.filter(option => option.nombresEstudiante?.toLowerCase().includes(filterValue)
      ||option.nombreApoyo?.toLocaleLowerCase().includes(filterValue)
    );
  }

  selectionAnexo11(anexo11: MatSelectionListChange){
    this.anexo11select=anexo11.option.value
    console.log(this.anexo11select)
    this.idpro=this.anexo11select.idProyecto;
    console.log("AAAAAAAAAAAAAAAAAAAAAAAAAA"+this.idpro)
    this.puntajea=this.anexo11select.apoyoPuntaje;
    resultado2?.forEach(value2 => {
      // @ts-ignore
      this.onAddRow(value2.item+"", value2.instrumento+"")
      console.log(this.rows.getRawValue())
    })
  }

  //Array
  onAddRow(director1:String,director:String) {
    this.sum = 0;
    this.rows.push(this.createItemFormGroup(director1,director));
    this.rows.getRawValue().forEach(element => {
      this.sum+=element.directorPuntaje;
      console.log(this.sum)
    })
    if(this.numerominimo-1>=this.sum){
      this.activar=true;
    }else{
      this.activar=false;
    }
  }
  onRemoveRow(rowIndex:number){
    this.sum = 0;
    this.rows.removeAt(rowIndex);
    this.rows.getRawValue().forEach(element => {
      this.sum+=element.directorItem3;
      console.log(this.sum)
    })
    if(this.numerominimo-1>=this.sum){
      this.activar=true;
    }else{
      this.activar=false;
    }
  }
  sumar(){
    this.sum = 0;
    this.rows.getRawValue().forEach(element => {
      this.sum+=element.directorItem3;
      console.log(this.sum)
    })
    if(this.numerominimo-1>=this.sum){
      this.activar=true;
    }else{
      this.activar=false;
    }
  }
  createItemFormGroup(director1:String,director:String): FormGroup {
    return this._formBuilder.group({
      directorItem1:[director1, Validators.required],
      directorItem2:[director, Validators.required],
      directorItem3:['', Validators.required],
    });
  }



  anexo11ob: Anexo11 = new Anexo11();
  obtenerdatos(){
    this.anexo11ob.id=this.anexo11select.id;
    this.anexo11ob.cedulaEstudiante=this.anexo11select.cedulaEstudiante;
    this.anexo11ob.carrera=this.anexo11select.carrera;
    this.anexo11ob.idProyecto=this.idpro;
    this.anexo11ob.nombreApoyo=this.anexo11select.nombreApoyo;
    this.anexo11ob.nombresEstudiante=this.anexo11select.nombresEstudiante;
    this.anexo11ob.cedulaEstudiante=this.anexo11select.cedulaEstudiante;
    this.anexo11ob.emailEstudiante=this.anexo11select.emailEstudiante;
    this.anexo11ob.directorPuntaje=this.sum;
    this.anexo11ob.nombreDirector=this.anexo11select.nombreDirector;
    this.anexo11ob.promedio=this.anexo11select.promedio;
    this.anexo11ob.fechaEvaluacion=this.fechae;
    this.anexo11ob.apoyo=this.anexo11select.apoyo;
    this.anexo11ob.fechaInicio=this.anexo11select.fechaInicio;
    this.anexo11ob.fechaFinaliza=this.anexo11select.fechaFinaliza;
    this.anexo11ob.apoyoPuntaje=this.anexo11select.apoyoPuntaje;
    // @ts-ignore
    this.anexo11ob.promedio=(this.puntajea+this.anexo11ob.directorPuntaje)/2
    // this.anexo11ob.totalHoras=this.numero;
    this.anexo11ob.director=this.rows.getRawValue();
    return this.anexo11ob;
  }


  edit(anexo11: Anexo11){
    anexo11=this.obtenerdatos();
    this.anexo11Service.updateanexo11(anexo11).subscribe(datos=>{
      Swal.fire({
        icon: 'success',
        title: 'EVALUACION TERMINADA',
        text: 'Datos guadados correctamente',
        confirmButtonColor: "#0c3255",
        background: "#fbc02d",
      })
    },err=>{
      Swal.fire({
        icon: 'warning',
        title: 'Al paracer hubo un problema',
        text: err.error.message,
        confirmButtonColor: "#0c3255",
        background: "#fbc02d",
      })
    })

  }


  generarDocumento11() {
    var anexo11:Anexo11=this.obtenerdatos();
    console.log(anexo11)
    var pipe:DatePipe = new DatePipe('en-US')
    loadFile("https://raw.githubusercontent.com/Jose-22-ced/VinculacionWeb/master/src/assets/docs/anexo11.docx", function(
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
      saveAs(out, "Anexo11.docx");
    });
  }

  subirDocumento11(file:FileList){
    if(file.length==0){
    }else{
      getBase64(file[0]).then(docx=>{
        // @ts-ignore
        console.log(docx.length)
        // @ts-ignore
        if(docx.length>=10485760){
          this.anexo11ob.documento="";
          Swal.fire(
            'Fallo',
            'El documento excede el peso permitido',
            'warning'
          )
        }else{
          this.anexo11ob.documento=docx+"";
        }
      })
    }
  }

}

import { Component, OnInit } from '@angular/core';
import {FormArray, FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {Anexo6} from "../../../models/anexo6";
import {Proyectos} from "../../../models/proyectos";
import {map, Observable, startWith} from "rxjs";
import {ActivatedRoute} from "@angular/router";
import {Anexo6Service} from "../../../services/anexo6.service";
import {IniciosesionService} from "../../../services/iniciosesion.service";
import {ProyectoService} from "../../../services/proyecto.service";
import {FechaService} from "../../../services/fecha.service";
import {MatSelectionListChange} from "@angular/material/list";
import {Anexo11, Anexo11ApoyoResponse} from "../../../models/anexo11";
import {Anexo11Service} from "../../../services/anexo11.service";
import Swal from "sweetalert2";
import {User} from "../../../models/user";
import {DateAdapter} from "@angular/material/core";
import {Anexo61} from "../../../models/anexo61";
import {DatePipe} from "@angular/common";
import Docxtemplater from "docxtemplater";
// @ts-ignore
import PizZip from "pizzip";
// @ts-ignore
import PizZipUtils from "pizzip/utils/index.js";
// @ts-ignore
import { saveAs } from "file-saver";
import {Anexo8Service} from "../../../services/anexo8.service";
import {Anexo8} from "../../../models/anexo8";

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

const resultado = [
  {item:'1.1',de: 'Control de Avance de Actividades: Cumple con las tareas planificadas\n' +
      '(En base a las actividades planteadas en el plan de aprendizaje)'},
  {item:'1.2' ,de: 'Resultados Alcanzados\n' +
      '(Presenta Informe indicando los resultados que se lograron con el proyecto\n' +
      'de vinculación en razón del cumplimiento de metas y objetivos)'},
  {item:'1.3' ,de: 'Demuestra conocimientos en el área de práctica pre profesional para cumplir con las\n' +
      '(El Tutor puede emitir juicios de valor con respecto al conocimiento\n' +
      'demostrado por el estudiante)'},
  {item:'1.4' ,de: 'Aplicación y manejo de destrezas y habilidades acordes al perfil profesional'},
]


@Component({
  selector: 'app-anexo11',
  templateUrl: './anexo11.component.html',
  styleUrls: ['./anexo11.component.css']
})


export class Anexo11Component implements OnInit {

  activar?:boolean=false;
  sum = 0;
  numerominimo=0;

  isLinear = true;
  panelOpenState = true;
  issloading = true;
  isexist?: boolean;
  myControl = new FormControl();
  cedula?:String;
  nombres?:String;
  fechai?:Date;
  fechaf?:Date;
  fechae?:Date;
  resultadoAnexo11?:String;
  user: User=new User();
  anexo8: Anexo8=new Anexo8();
  anexo8select: Anexo8[] = []
  anexo6: Anexo6[] = []
  anexo6select: Anexo6 = new Anexo6();
  proyectoselect: Proyectos = new Proyectos();
  filteredOptions?: Observable<Anexo6[]>;
  firstFormGroup?: FormGroup;
  secondFormGroup?:FormGroup;
  thirdFormGroup?:FormGroup;
  fourFormGroup?:FormGroup;
  fiveFormGroup?:FormGroup;
  numero?:Number;
  rows: FormArray;
  itemForm?: FormGroup;
  rows2: FormArray;
  itemForm2?: FormGroup;
  apoyoItem1?:String

  constructor(private activatedRoute: ActivatedRoute,
              private _formBuilder: FormBuilder,
              private anexo6Service: Anexo6Service,
              private usarioService: IniciosesionService,
              private proyectoService: ProyectoService,
              private fechaService: FechaService,
              private _adapter: DateAdapter<any>,
              private anexo11Service: Anexo11Service,
              private anexo8Service:Anexo8Service,

  ) {
    this._adapter.setLocale('es-ec');
    this.thirdFormGroup = this._formBuilder.group({
      items: [null, Validators.required],
      items_value: ['no', Validators.required]
    });
    this.rows = this._formBuilder.array([]);

    this.fiveFormGroup = this._formBuilder.group({
      items: [null, Validators.required],
      items_value: ['no', Validators.required]
    });
    this.rows2 = this._formBuilder.array([]);

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
      this.anexo6Service.getAnexo6all().subscribe(data => {
        this.anexo6 = data.filter(value => value.cedulaDocente==cedula);
        this.filteredOptions = this.myControl.valueChanges.pipe(
          startWith(''),
          map(values => this.filter(values)),
        );
        this.issloading = false;

      })
      this.fechaService.getSysdate().subscribe(value => {
        this.fechae = value.fecha;
      })
    })

    this.firstFormGroup = this._formBuilder.group({
      anexo6: ['', Validators.required]
    });
    this.secondFormGroup = this._formBuilder.group({
      // numero:['', Validators.required],
      fechai:['', Validators.required],
      fechaf:['', Validators.required],
    });
    this.thirdFormGroup = this._formBuilder.group({
      // resultadoAnexo11:['', Validators.required]
    });
    this.fiveFormGroup = this._formBuilder.group({
    });
    // this.fourFormGroup = this._formBuilder.group({
    //   docx: ['', Validators.required],
    // });
    //ArrayActividades
    this.thirdFormGroup.get("items_value")?.setValue("yes");
    this.thirdFormGroup.addControl('rows', this.rows);

    this.fiveFormGroup.get("items_value")?.setValue("yes");
    this.fiveFormGroup.addControl('rows2', this.rows2);
  }
  filter(value: any): Anexo6[] {
    const filterValue = value.toString().toLowerCase();
    return this.anexo6.filter(option => option.nombreProyecto?.toLowerCase().includes(filterValue)
      ||option.nombreEstudiante?.toLocaleLowerCase().includes(filterValue)
      ||option.cedulaEstudiante?.toLocaleLowerCase().includes(filterValue)
    );
  }

  selectionAnexo6(anexo6: MatSelectionListChange){
    this.anexo6select=anexo6.option.value
    //this.usarioService.
    this.proyectoService.getProyectobyid(Number(this.anexo6select.proyectoId)).subscribe(dataP=>{
      this.proyectoselect=dataP
    })

    this.anexo11Service.getusuario(this.anexo6select.cedulaEstudiante+'').subscribe(dataUser=>{
      this.user=dataUser
    })
    this.anexo8Service.getAnexo8byCedula(this.anexo6select.cedulaEstudiante+'').subscribe(data=>{
      this.anexo8=data[0]
    })

    resultado?.forEach(value2 => {
      // @ts-ignore
      this.onAddRow(value2.item+"", value2.de+"")
    })


  }

  //Array
  onAddRow(apoyo1:String,apoyo:String) {
    this.sum = 0;
    this.rows.push(this.createItemFormGroup(apoyo1,apoyo));
    this.rows.getRawValue().forEach(element => {
      this.sum+=element.apoyoPuntaje;
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
      this.sum+=element.apoyoItem3;
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
      this.sum+=element.apoyoItem3;
    })
    if(this.numerominimo-1>=this.sum){
      this.activar=true;
    }else{
      this.activar=false;
    }
  }
  createItemFormGroup(apoyo1:String,apoyo:String): FormGroup {
    return this._formBuilder.group({
      apoyoItem1:[apoyo1, Validators.required],
      apoyoItem2:[apoyo, Validators.required],
      apoyoItem3:['', Validators.required],
    });
  }

  onAddRow1(director:String) {
    this.rows2.push(this.createItemFormGroup2(director));
    // console.log(this.rows2.getRawValue())
  }
  createItemFormGroup2(director:String): FormGroup {
    return this._formBuilder.group({
      directoroitem1:[''],
      directorItem2:[''],
      directorItem3:[''],
      directorItem4:[''],
    });
  }

  anexo11ob: Anexo11 = new Anexo11();
  obtenerdatos(){
    this.anexo11ob.cedulaEstudiante=this.anexo6select.cedulaEstudiante;
    this.anexo11ob.carrera=this.proyectoselect.carrera;
    this.anexo11ob.idProyecto=this.proyectoselect.id;
    this.anexo11ob.nombreApoyo=this.nombres;
    this.anexo11ob.nombresEstudiante=this.anexo6select.nombreEstudiante;
    this.anexo11ob.cedulaEstudiante=this.anexo6select.cedulaEstudiante;
    this.anexo11ob.emailEstudiante=this.user.email;
    this.anexo11ob.apoyoPuntaje=this.sum;
    this.anexo11ob.nombreDirector=this.proyectoselect.nombredirector;
    this.anexo11ob.promedio=this.anexo11ob.promedio;
    this.anexo11ob.fechaEvaluacion=this.fechae;
    this.anexo11ob.totalHoras=parseInt(this.anexo8.totalHoras+'');
    this.anexo11ob.apoyo=this.rows.getRawValue();
    this.anexo11ob.director=this.rows2.getRawValue();
    return this.anexo11ob;
  }


  guardar(){
    this.anexo11ob=this.obtenerdatos();
    this.anexo11Service.saveAnexo11(this.obtenerdatos()).subscribe(datos=>{
      Swal.fire({
        icon: 'success',
        title: 'EVALUACION AL ESTUDIANTE COMPLETADA',
        text: 'Datos guadados correctamente,' +
          ' CUANDO EL DIRECTOR DE PROYECTO CULMINE SU RESPECTIVA EVALUACION' +
          ' > DESCAGUE EL DOCUMENTO Y FIRME ',

        confirmButtonColor: "#0c3255",
        background: "#fbc02d",
      })
      // window.location.reload();
    },err=>{
      Swal.fire({
        icon: 'warning',
        title: 'Al paracer hubo un problema',
        text: err.error.message,
        confirmButtonColor: "#0c3255",
        background: "#fbc02d",
      })
      window.location.reload();
      this.issloading=false;
    })

  }


  subirDocumento11(file:FileList){
    if(file.length==0){
    }else{
      getBase64(file[0]).then(docx=>{
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
        nombreDocenteApoyo:anexo11.nombreApoyo,
        puntaje1:anexo11.apoyoPuntaje,
        nombreDirectoProyecto:anexo11.nombreDirector,
        nombreEstudiante:anexo11.nombresEstudiante,
        cedulaEs:anexo11.cedulaEstudiante,
        emailEst:anexo11.emailEstudiante,
        carrera:anexo11.carrera,
        numHoras:anexo11.totalHoras,


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
        //console.log(JSON.stringify({ error: error }, replaceErrors));
        // @ts-ignore
        if (error.properties && error.properties.errors instanceof Array) {
          // @ts-ignore
          const errorMessages = error.properties.errors
            // @ts-ignore
            .map(function(error) {
              return error.properties.explanation;
            })
            .join("\n");
          //console.log("errorMessages", errorMessages);
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

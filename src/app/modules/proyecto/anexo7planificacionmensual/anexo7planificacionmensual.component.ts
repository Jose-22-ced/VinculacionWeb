import {Component, OnInit, ViewChild} from '@angular/core';
import {Anexo3Service} from "../../../services/anexo3.service";
import {Anexo7Service} from "../../../services/anexo7.service";
import {ProyectoService} from "../../../services/proyecto.service";
import {Anexo1Service} from "../../../services/anexo1.service";
import {FormArray, FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {Anexo6Service} from "../../../services/anexo6.service";
import {Anexo6} from "../../../models/anexo6";
import {Proyectos} from "../../../models/proyectos";
import {Anexo3} from "../../../models/anexo3";
import {Anexo1} from "../../../models/anexo1";
import {Anexo7, HorasDocentesA7Request, HorasEstudiantesA7Request} from "../../../models/anexo7";
import Swal from "sweetalert2";
// @ts-ignore
import PizZip from "pizzip";
// @ts-ignore
import PizZipUtils from "pizzip/utils/index.js";
// @ts-ignore
import { saveAs } from "file-saver";
import {FechaService} from "../../../services/fecha.service";
import {Anexo2Service} from "../../../services/anexo2.service";
import {Anexo2} from "../../../models/anexo2";
import {map, Observable, startWith} from "rxjs";
import {MatChip} from "@angular/material/chips";
import {DatePipe} from "@angular/common";
import Docxtemplater from "docxtemplater";



import {MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS} from '@angular/material-moment-adapter';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';
import {MatDatepicker} from '@angular/material/datepicker';

// Depending on whether rollup is used, moment needs to be imported differently.
// Since Moment.js doesn't have a default export, we normally need to import using the `* as`
// syntax. However, rollup creates a synthetic default module and we thus need to import it using
// the `default as` syntax.
import * as _moment from 'moment';
// tslint:disable-next-line:no-duplicate-imports

// @ts-ignore
import {default as _rollupMoment, Moment} from 'moment';
import {variable} from "@angular/compiler/src/output/output_ast";

const moment = _rollupMoment || _moment;

// See the Moment.js docs for the meaning of these formats:
// https://momentjs.com/docs/#/displaying/format/
export const MY_FORMATS = {
  parse: {
    dateInput: 'D/MMMM/YYYY',
  },
  display: {
    dateInput: 'D/MMMM/YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

/** @title Datepicker emulating a Year and month picker */

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
  selector: 'app-anexo7planificacionmensual',
  templateUrl: './anexo7planificacionmensual.component.html',
  styleUrls: ['./anexo7planificacionmensual.component.css'],
  providers: [
    // `MomentDateAdapter` can be automatically provided by importing `MomentDateModule` in your
    // application's root module. We provide it at the component level here, due to limitations of
    // our example generation script.
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS],
    },
    {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS},
  ],
})


export class Anexo7planificacionmensualComponent implements OnInit {

  isLinear = true;
  panelOpenState = true;
  issloading = true;
  isexist?: boolean;
  anexo7select:Anexo7=new Anexo7();
  proyecto:Proyectos=new Proyectos();
  anexo7?:Anexo7[]=[];
  anexoss7:Anexo7=new Anexo7();
  proyectos:Proyectos[]=[];
  proyectoselect:Proyectos=new Proyectos();
  anexo1:Anexo1[]=[];
  rows: FormArray;
  itemForm?: FormGroup;
  rows1: FormArray;
  // rows1: FormArray;
  // itemForm1?: FormGroup;

  firstFormGroup?: FormGroup;
  secondFormGroup?: FormGroup;
  thirdFormGroup?: FormGroup;
  fourFormGroup?: FormGroup;

  anexo3:Anexo3[]=[];
  anexo2:Anexo2=new Anexo2();
  anexo6:Anexo6= new Anexo6();
  anexo7es: Anexo7 = new Anexo7();
  cedula?: String;
  nombres?:String;
  nombreproyecto?:String;
  empresa?:String;
  fechaPlanificacion?:Date;
  mesAnioPlanificado?:Date;
  directorproyecto?:String;
  dato:any;
  fecha?:Date;
  docentess?:String[];
  numdemes?:Number;
//filtros
  myControl = new FormControl();
  filteredOptions?: Observable<Proyectos[]>;
  pipe:DatePipe = new DatePipe('en-US')


  max?:Boolean;

  date = new FormControl(moment());
  setMonthAndYear(normalizedMonthAndYear: Moment, datepicker: MatDatepicker<Moment>) {
    const ctrlValue = this.date.value;
    ctrlValue.month(normalizedMonthAndYear.month());
    ctrlValue.year(normalizedMonthAndYear.year());
    this.date.setValue(ctrlValue);
    datepicker.close();
  }

  constructor(private anexo7service:Anexo7Service,
              private router: Router, private activatedRoute: ActivatedRoute, private _formBuilder: FormBuilder,
              private fechaService: FechaService, private proyectoService:ProyectoService, private anexo1Service:Anexo1Service,
              private anexo3Service: Anexo3Service, private anexo2Service:Anexo2Service,private _adapter: DateAdapter<any>) {

    this._adapter.setLocale('es-ec')

    this.secondFormGroup = this._formBuilder.group({
      items: [null, Validators.required],
      items_value: ['no', Validators.required]
    });
    this.rows = this._formBuilder.array([]);

    this.thirdFormGroup= this._formBuilder.group({
      items: [null, Validators.required],
      items_value: ['no', Validators.required]
    });
    this.rows1 = this._formBuilder.array([]);
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
    }, 1000)
  }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params => {
      //parametros
      let cedula = params['cedula']
      let nombres = params['nombres']
      this.cedula=cedula;
      this.nombres = nombres;
      console.log(cedula)
      this.fechaService.getSysdate().subscribe(value => {
        this.anexoss71.fechaPlanificacion=value.fecha;
      })
      //filtros para obtner datos de entidad, proyecto por id de proyecto.
      this.anexo1Service.getAnexo1byCedula(cedula).subscribe(datos=>{
        this.proyectoService.getProyectobyid(Number(datos[0].idProyectoPPP)).subscribe(data=> {
          this.proyecto=data
          this.anexo7service.getAnexo7All().subscribe(value => {
            this.numdemes=value.filter(value1 => value1.idProyecto==Number(datos[0].idProyectoPPP)).length;
            var hora: string[]
            // @ts-ignore
            hora=this.proyecto.plazoEjecucion.split(" ");
            this.max=(value.filter(value1 => value1.idProyecto==Number(datos[0].idProyectoPPP)).length==Number(hora[0]))?true:false;
            this.issloading=false;
          })
      ///llenado de filas de actividades del proyecto
      data.actividadeslistProyectos?.forEach(value1 => {
        this.onAddRow(value1.descripcion+"")
        console.log(value1.descripcion)
      })
      data.actividadeslistProyectos?.forEach(value1 => {
            this.onAddRow1(value1.descripcion+"")
            console.log(value1.descripcion)
      })
      this.anexo3Service.getAnexo3byProyecto(data.id).subscribe(dates=>{
            this.anexo3=dates.filter(d=>d.estado=='AN')
            console.log(this.anexo3);
      })
          this.anexo1Service.getAnexo1byIdProyecto(data.id).subscribe(datosap=>{
            this.anexo1=datosap
          })
        this.anexo2Service.getAnexoByidProyecto(data.id).subscribe(dt=>
        {
          this.anexo2=dt;
        })
      ///BARRAS DE BUSQUEDAS
      this.proyectoService.getProyectos().subscribe(data => {
      this.proyectos = data.filter(value => value.nombredirector==nombres);
      console.log(data);
      this.filteredOptions = this.myControl.valueChanges.pipe(
        startWith(''),
        map(values => this.filter(values)),
          );
       })
       console.log(this.proyecto)
      });
      })
      this.fechaService.getSysdate().subscribe(value => {
        this.fecha = value.fecha;
      })
    })
    ///PARA HACER VALIDADIONES DE CAMPOS NO VACIOS
      this.firstFormGroup = this._formBuilder.group({
        mesAnioPlanificado: ['', Validators.required],
      });
    this.secondFormGroup = this._formBuilder.group({});
    this.thirdFormGroup = this._formBuilder.group({});
    this.fourFormGroup = this._formBuilder.group({
    });
    //ArrayDocentes
    this.secondFormGroup.get("items_value")?.setValue("yes");
    this.secondFormGroup.addControl('rows', this.rows);
    //ArrayEstudiantes
    this.thirdFormGroup.get("items_value")?.setValue("yes");
    this.thirdFormGroup.addControl('rows1', this.rows1);
  }

  //filas DOCENTES
  onAddRow(horasDocentes:String) {
    this.rows.push(this.createItemFormGroup(horasDocentes));
    console.log(this.rows.getRawValue())
  }
  onRemoveRow(rowIndex: number) {
    this.rows.removeAt(rowIndex);
  }
  createItemFormGroup(horasDocentes:String): FormGroup {
    return this._formBuilder.group({
      resultados: ['', Validators.required],
      actividad: [horasDocentes, Validators.required],
      nombreDocenteApoyo: [[], Validators.required ],
      numHoras: ['', Validators.required],
      fechaInicio: [this.pipe.transform('','dd/MM/yyyy'), Validators.required],
      fechaFin: [this.pipe.transform('','dd/MM/yyyy'), Validators.required],
      observaciones: ['', Validators.required]
    });
  }

  //filas ESTUDIANTES
  onAddRow1(horasEstudiantes:String) {
    this.rows1.push(this.createItemFormGroup1(horasEstudiantes));
    console.log(this.rows1.getRawValue())
  }
  onRemoveRow1(rowIndex: number) {
    this.rows1.removeAt(rowIndex);
  }
  createItemFormGroup1(horasEstudiantes:String): FormGroup {
    // this.docentess?.push(horasEstudiantes.)
    return this._formBuilder.group({
      resultados: [ '', Validators.required],
      actividad: [horasEstudiantes, Validators.required],
      nombreEstudiante:[[], Validators.required],
      numHoras: ['', Validators.required],
      fechaInicio: [this.pipe.transform('','dd/MM/yyyy'), Validators.required],
      fechaFin: [this.pipe.transform('','dd/MM/yyyy'), Validators.required],
      observaciones: ['', Validators.required]
    });
  }


  //FILTER PARA REALIZAR BUSQUEDAS EN CAJAS DE TEXTO/
  filter(value: any): Proyectos[] {
    const filterValue = value.toString().toLowerCase();
    return this.proyectos.filter(option => option.nombre?.toLowerCase().includes(filterValue)
      ||option.codigo?.toLocaleLowerCase().includes(filterValue)
      ||option.carrera?.toLocaleLowerCase().includes(filterValue)
    );
  }

  anexoss71: Anexo7 = new Anexo7();
  obtnerdatos(){
    this.anexoss71.idProyecto = this.proyecto.id;
    this.anexoss71.nombreEntidadBeneficiaria= this.anexo2.entidadBeneficiaria;
    this.anexoss71.nombreDirectorProyecto= this.nombres;
    this.anexoss71.nombreProyecto=this.proyecto.nombre;
    this.anexoss71.horasDocentes = this.rows.getRawValue();
    this.anexoss71.horasEstudiantes = this.rows1.getRawValue();
    return this.anexoss71;
  }

  toggleSelection(chip: MatChip) {
    chip.toggleSelected();
  }


  //////////////GUARDAR///////////////
  guardaranexo7(){
    this.issloading=true;
    var anexo7=this.obtnerdatos();
    this.anexo7service.saveAnexo7(anexo7).subscribe(value => {
      Swal.fire({
        title: 'Éxito',
        text: 'Informe de segimiento guardado.',
        icon: 'success',
        iconColor :'#17550c',
        color: "#0c3255",
        confirmButtonColor:"#0c3255",
        background: "#fbc02d",
      })
      this.issloading=false;
      this.router.navigate(['/panelusuario/proyectovinculacion/verplatificaciones',this.cedula,this.nombres]);
    },error => {
      Swal.fire({
        title: 'Ha surgido un error',
        text: "Hubo un error, contáctese con TICs.",
        icon: 'error',
        color: "#0c3255",
        confirmButtonColor:"#0c3255",
        background: "#fbc02d",
      })
      this.issloading=false;
    })
  }

  subirDocumento711(file:FileList){
    if(file.length==0){
    }else{
      getBase64(file[0]).then(docx=>{
        // @ts-ignore
        console.log(docx.length)
        // @ts-ignore
        if(docx.length>=10485760){
          this.anexoss71.documento="";
          Swal.fire(
            'Fallo',
            'El documento excede el peso permitido',
            'warning'
          )
        }else{
          this.anexoss71.documento=docx+"";
        }
      })
    }
  }

  generarDocumento711(anexo3:Anexo3[]) {
    var anexo7:Anexo7=this.obtnerdatos();
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

import { Component, OnInit } from '@angular/core';
import {Anexo7, HorasDocentesA7Request, HorasEstudiantesA7Request} from "../../../models/anexo7";
import {Proyectos} from "../../../models/proyectos";
import {Anexo1} from "../../../models/anexo1";
import {FormArray, FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {Anexo3} from "../../../models/anexo3";
import {Anexo2} from "../../../models/anexo2";
import {Anexo6} from "../../../models/anexo6";
import {Observable} from "rxjs";
import {DatePipe} from "@angular/common";
import {Moment} from "moment";
import {MatDatepicker} from "@angular/material/datepicker";
import {Anexo7Service} from "../../../services/anexo7.service";
import {ActivatedRoute, Router} from "@angular/router";
import {FechaService} from "../../../services/fecha.service";
import {ProyectoService} from "../../../services/proyecto.service";
import {Anexo1Service} from "../../../services/anexo1.service";
import {Anexo3Service} from "../../../services/anexo3.service";
import {Anexo2Service} from "../../../services/anexo2.service";
import {DateAdapter} from "@angular/material/core";
import {Anexo4Service} from "../../../services/anexo4.service";
import {Anexo4} from "../../../models/anexo4";
import Swal from "sweetalert2";

@Component({
  selector: 'app-editar7planmesual',
  templateUrl: './ediatar7planmesual.component.html',
  styleUrls: ['./ediatar7planmesual.component.css']
})
export class Editar7planmesualComponent implements OnInit {


  isLinear = true;
  panelOpenState = true;
  issloading = true;
  isexist?: boolean;
  anexo7:Anexo7=new Anexo7();
  proyecto:Proyectos=new Proyectos();
  anexo7list?:Anexo7[]=[];
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

  anexp4:Anexo4[]=[];

  constructor(private anexo7service:Anexo7Service,
              private router: Router, private activatedRoute: ActivatedRoute, private _formBuilder: FormBuilder,
              private fechaService: FechaService, private proyectoService:ProyectoService, private anexo1Service:Anexo1Service,
              private anexo3Service: Anexo3Service, private anexo2Service:Anexo2Service,private _adapter: DateAdapter<any>,
              private anexo4Service:Anexo4Service) {

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

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params => {
      let id = params['id']
      let cedula = params['cedula']
      let nombres = params['nombres']
      this.anexo7service.getAnexo7All().subscribe(value => {
        this.anexo7=value.filter(value1 => value1.id=id)[0]
        // @ts-ignore
        this.anexo7.horasEstudiantes.forEach(value1 => {
          this.onAddRow1(value1)
        })
        // @ts-ignore
        this.anexo7.horasDocentes.forEach(value1 => {
          this.onAddRow(value1)
        })
        this.proyectoService.getProyectobyid(Number(value[0].idProyecto)).subscribe(data=> {
          this.proyecto=data
          this.anexo1Service.getAnexo1byIdProyecto(data.id).subscribe(datosap=>{
            this.anexo1=datosap
            this.anexo4Service.getAnexo4All().subscribe(value1 => {
              this.anexp4=value1.filter(value2 => value2.idProyectoPPP==data.id&&value2.num_proceso==2);
            })
            this.anexo3Service.getAnexo3byProyecto(data.id).subscribe(dates=>{
              this.anexo3=dates.filter(d=>d.estado=='AN')
              //console.log(this.anexo3);
            })
            this.issloading=false;
          })
        })
      })
    })

    ///PARA HACER VALIDADIONES DE CAMPOS NO VACIOS
    this.firstFormGroup = this._formBuilder.group({
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
  onAddRow(horasDocentes:HorasDocentesA7Request) {
    this.rows.push(this.createItemFormGroup(horasDocentes));
    //console.log(this.rows.getRawValue())
  }
  onRemoveRow(rowIndex: number) {
    this.rows.removeAt(rowIndex);
  }
  createItemFormGroup(horasDocentes:HorasDocentesA7Request): FormGroup {
    return this._formBuilder.group({
      id:horasDocentes.id,
      resultados: [horasDocentes.resultados, Validators.required],
      actividad: [horasDocentes.actividad, Validators.required],
      cedulaDocente: [horasDocentes.cedulaDocente,Validators.required],
      nombreDocenteApoyo: [horasDocentes.nombreDocenteApoyo, Validators.required ],
      numHoras: [horasDocentes.numHoras, Validators.required],
      fechaInicio: [horasDocentes.fechaInicio, Validators.required],
      fechaFin: [horasDocentes.fechaFin, Validators.required],
      observaciones: [horasDocentes.observaciones, Validators.required]
    });
  }

  //filas ESTUDIANTES
  onAddRow1(horasEstudiantes:HorasEstudiantesA7Request) {
    this.rows1.push(this.createItemFormGroup1(horasEstudiantes));
    //console.log(this.rows1.getRawValue())
  }
  onRemoveRow1(rowIndex: number) {
    this.rows1.removeAt(rowIndex);
  }
  createItemFormGroup1(horasEstudiantes:HorasEstudiantesA7Request): FormGroup {
    //console.log(horasEstudiantes)
    // this.docentess?.push(horasEstudiantes.)
    return this._formBuilder.group({
      id:horasEstudiantes.id,
      resultados: [ horasEstudiantes.resultados, Validators.required],
      actividad: [horasEstudiantes.actividad, Validators.required],
      cedulaEstudiante: [horasEstudiantes.cedulaEstudiante, Validators.required],
      nombreEstudiante:[horasEstudiantes.nombreEstudiante, Validators.required],
      numHoras: [horasEstudiantes.numHoras, Validators.required],
      fechaInicio: [horasEstudiantes.fechaInicio, Validators.required],
      fechaFin: [horasEstudiantes.fechaFin, Validators.required],
      observaciones: [horasEstudiantes.observaciones, Validators.required]
    });
  }

  obtnerdatos(){
    this.anexo7.horasDocentes = this.rows.getRawValue();
    this.anexo7.horasEstudiantes = this.rows1.getRawValue();
    return this.anexo7;
  }

  //////////////GUARDAR///////////////
  guardaranexo7(){
    this.issloading=true;
    var anexo7=this.obtnerdatos();
    //console.log(anexo7)
    this.anexo7service.updateAnexo7(anexo7).subscribe(value => {
      Swal.fire({
        title: 'Exito',
        text: 'Planeacion actualizada',
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
        title: 'Error',
        text: 'Planeacion no se actualizada '+error.error.message,
        icon: 'error',
        color: "#0c3255",
        confirmButtonColor:"#0c3255",
        background: "#fbc02d",
      })
      this.issloading=false;
    })
  }

}

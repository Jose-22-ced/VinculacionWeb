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
  fecha?:Date;
  user: User=new User();
  anexo6: Anexo6[] = []
  anexo6select: Anexo6 = new Anexo6();
  proyectoselect: Proyectos = new Proyectos();
  filteredOptions?: Observable<Anexo6[]>;
  //secuenciasdepantallas
  firstFormGroup?: FormGroup;
  secondFormGroup?:FormGroup;
  thirdFormGroup?:FormGroup;
  fiveFormGroup?:FormGroup;
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
        this.anexo6 = data.filter(value => value.nombreDocenteApoyo==nombres);
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
      numero:['', Validators.required],
      fecha:['', Validators.required]
    });
    this.thirdFormGroup = this._formBuilder.group({
    });
    this.fiveFormGroup = this._formBuilder.group({
    });
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
    console.log(this.anexo6select.cedulaEstudiante)
    //this.usarioService.
    this.proyectoService.getProyectobyid(Number(this.anexo6select.proyectoId)).subscribe(dataP=>{
      this.proyectoselect=dataP
    })

    this.anexo11Service.getusuario(this.anexo6select.cedulaEstudiante+'').subscribe(dataUser=>{
        this.user=dataUser
      console.log(this.user)
    })


    resultado?.forEach(value2 => {
        // @ts-ignore
        this.onAddRow(value2.item+"", value2.de+"")
        console.log(this.rows.getRawValue())
      })


  }

  //ArrayActividades
  onAddRow(apoyo1:String,apoyo:String) {
    this.sum = 0;
    this.rows.push(this.createItemFormGroup(apoyo1,apoyo));
    this.rows.getRawValue().forEach(element => {
      this.sum+=element.apoyoPuntaje;
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
      this.sum+=element.apoyoPuntaje;
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
      this.sum+=element.apoyoPuntaje;
      console.log(this.sum)
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
      apoyoPuntaje:['', Validators.required],
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
    this.anexo11ob.apoyo=this.rows.getRawValue();
    this.anexo11ob.director=this.rows2.getRawValue();
    // this.anexo11ob.totalHoras=this.anexo11ob.totalHoras;
    this.anexo11ob.emailEstudiante=this.user.email;
    return this.anexo11ob;
}


  guardar(){
    this.anexo11ob=this.obtenerdatos();
    this.anexo11Service.saveAnexo11(this.obtenerdatos()).subscribe(datos=>{
      Swal.fire({
        icon: 'success',
        title: 'EVALUACION AL ESTUDIANTE COMPLETADA',
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

}

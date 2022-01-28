import { Component, OnInit } from '@angular/core';
import {FormArray, FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {ActivatedRoute} from "@angular/router";
import {ResponsablepppService} from "../../../services/responsableppp.service";
import {CarrerasService} from "../../../services/carreras.service";
import {map, Observable, startWith} from "rxjs";
import {Docentes} from "../../../models/docentes";
import {CordinadorVinculacion} from "../../../models/cordinadorvinculacion";
import {MatTableDataSource} from "@angular/material/table";

@Component({
  selector: 'app-nuevoproyecto',
  templateUrl: './nuevoproyecto.component.html',
  styleUrls: ['./nuevoproyecto.component.css']
})
export class NuevoproyectoComponent implements OnInit {
  panelOpenState = false;
  isLinear = true;
  firstFormGroup?: FormGroup;
  // @ts-ignore
  secondFormGroup: FormGroup;
  thirdFormGroup?: FormGroup;
  rows: FormArray;
  carrera?: String;
  resposableppp?:String;
  docentes:Docentes[]=[];
  docentesselectApoyo:Docentes[]=[]
  docentesselect:Docentes = new Docentes();

  myControl = new FormControl();
  myControl1 = new FormControl();
  filteredOptions?: Observable<Docentes[]>;
  filteredOptionsapoyo?: Observable<Docentes[]>;

  constructor(private carrerasService:CarrerasService,private responsablepppService:ResponsablepppService,private activatedRoute: ActivatedRoute,private _formBuilder: FormBuilder) {
    //ArrayActividades
    this.rows = this._formBuilder.array([]);
  }

  ngOnInit() {
    this.responsablepppService.getDocentesbyAll().subscribe(value => {
      this.docentes=value;
      this.filteredOptions = this.myControl.valueChanges.pipe(
        startWith(''),
        map(values=>this.filter(values)),
      );
      this.filteredOptionsapoyo = this.myControl1.valueChanges.pipe(
        startWith(''),
        map(values=>this.filter(values)),
      );
    })
    this.activatedRoute.params.subscribe( params => {
      let cedula = params['cedula']
      this.responsablepppService.getDocenteCarrerabyCedula(cedula).subscribe(value => {
        // @ts-ignore
        this.carrerasService.getCarreras().subscribe(value1 => {
          // @ts-ignore
          this.carrera = value1.filter(value2 => value2.codigo==value[0].codigo)[0].nombre
        })
        // @ts-ignore
        this.responsablepppService.getResposablepppbyCarrera(value[0].codigo).subscribe(data=>{
          this.resposableppp=data.nombres_completo;
        },err=>{

        })
      })
    })
    this.rows.push(this.createItemFormGroup());
    this.firstFormGroup = this._formBuilder.group({
      nombre: ['', Validators.required],
      programa: ['', Validators.required],
      alcance:['', Validators.required],
      linea: ['', Validators.required],
      estado: ['', Validators.required],
      plazo: ['', Validators.required],
      start: ['', Validators.required],
      end: ['', Validators.required],
    });
    this.secondFormGroup = this._formBuilder.group({
      objetivo: ['', Validators.required],
    });
    this.thirdFormGroup = this._formBuilder.group({
    });
    // @ts-ignore
    this.secondFormGroup.get("items_value")?.setValue("yes");
    // @ts-ignore
    this.secondFormGroup.addControl('rows', this.rows);
  }
  filter(value: any): CordinadorVinculacion[] {
    const filterValue = value.toLowerCase();
    return this.docentes.filter(option => option.nombres_completo?.toLowerCase().includes(filterValue)
      ||option.titulo?.toLocaleLowerCase().includes(filterValue)
      ||option.cedula?.toLocaleLowerCase().includes(filterValue)
      ||option.docente_tipo_tiempo?.toLocaleLowerCase().includes(filterValue)
    );
  }
  filter0(value: any): CordinadorVinculacion[] {
    const filterValue = value.toLowerCase();
    return this.docentes.filter(option => option.nombres_completo?.toLowerCase().includes(filterValue)
      ||option.titulo?.toLocaleLowerCase().includes(filterValue)
      ||option.cedula?.toLocaleLowerCase().includes(filterValue)
      ||option.docente_tipo_tiempo?.toLocaleLowerCase().includes(filterValue)
    );
  }
  //ArrayActividades
  onAddRow() {
    // @ts-ignore
    this.rows.push(this.createItemFormGroup());
    // @ts-ignore
    console.log(this.rows.getRawValue())
  }
  onRemoveRow(rowIndex:number){
    // @ts-ignore
    this.rows.removeAt(rowIndex);
  }
  createItemFormGroup(): FormGroup {
    return this._formBuilder.group({
      descripcion: ['', Validators.required],
    });
  }

  //Tabla
  addApoyo(docente:Docentes){
    if(this.docentesselectApoyo.filter(value => value.cedula==docente.cedula).length==0){
      this.docentesselectApoyo.push(docente);
    }
    console.log(this.docentesselectApoyo)
  }
  removeApoyo(docente:Docentes){
    this.docentesselectApoyo.forEach((element,index)=>{
      if(element.cedula==docente.cedula) this.docentesselectApoyo.splice(index,1);
    });
    console.log(this.docentesselectApoyo)
  }

  public displayDedicacion (dedicacionSel:Docentes): string {
    if (dedicacionSel != null){
      return dedicacionSel.nombres_completo+"";
    }else{
      return "";
    }
  }


}


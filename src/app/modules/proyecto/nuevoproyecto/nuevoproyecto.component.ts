import { Component, OnInit } from '@angular/core';
import {FormArray, FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {ActivatedRoute} from "@angular/router";
import {ResponsablepppService} from "../../../services/responsableppp.service";
import {CarrerasService} from "../../../services/carreras.service";
import {map, Observable, startWith} from "rxjs";
import {Docentes} from "../../../models/docentes";
import {Anexo1} from "../../../models/anexo1";
import {FechaService} from "../../../services/fecha.service";
import Docxtemplater from "docxtemplater";
// @ts-ignore
import PizZip from "pizzip";
// @ts-ignore
import PizZipUtils from "pizzip/utils/index.js";
// @ts-ignore
import { saveAs } from "file-saver";
import {MatSelectionListChange} from "@angular/material/list";
import {Proyectos} from "../../../models/proyectos";
import {Entidadbeneficiaria} from "../../../models/entidadbeneficiaria";
import {EntidadbeneficiarioService} from "../../../services/entidadbeneficiario.service";

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
  selector: 'app-nuevoproyecto',
  templateUrl: './nuevoproyecto.component.html',
  styleUrls: ['./nuevoproyecto.component.css']
})
export class NuevoproyectoComponent implements OnInit {
  panelOpenState = true;
  isLinear = true;
  firstFormGroup?: FormGroup;
  // @ts-ignore
  secondFormGroup: FormGroup;
  thirdFormGroup?: FormGroup;
  // @ts-ignore
  fourFormGroup: FormGroup;
  rows: FormArray;

  docentes:Docentes[]=[];
  docentesselectDirector:Docentes = new Docentes();
  docentesselectApoyo:Docentes[]=[]
  proyecto:Proyectos = new Proyectos();
  entidadBeneficiaria:Entidadbeneficiaria []=[];
  anexo1:Anexo1[]=[];
  myControl = new FormControl();
  myControl1 = new FormControl();
  filteredOptions?: Observable<Docentes[]>;
  filteredOptionsapoyo?: Observable<Docentes[]>;

  //
  carrera?: String;
  Siglas?:String;
  CedulaC?:String;
  NombreC?:String
  Fechaat?:Date;

  constructor(private fechaService:FechaService,private carrerasService:CarrerasService,
              private responsablepppService:ResponsablepppService,
              private activatedRoute: ActivatedRoute,private _formBuilder: FormBuilder,
              private entidadbeneficiarioService:EntidadbeneficiarioService) {
    //ArrayActividades
    this.rows = this._formBuilder.array([]);
  }

  ngOnInit() {
    this.obtnerDatos();
    this.responsablepppService.getDocentesbyAll().subscribe(value => {
      this.docentes=value;
      this.filteredOptions = this.myControl.valueChanges.pipe(
        startWith(''),
        map(values=>this.filter(values)),
      );
      this.filteredOptionsapoyo = this.myControl1.valueChanges.pipe(
        startWith(''),
        map(values=>this.filter0(values)),
      );
    })
    this.entidadbeneficiarioService.getEntidadBeneficiariaAll().subscribe(value => {
      this.entidadBeneficiaria=value;
    })
    this.activatedRoute.params.subscribe( params => {
      let cedula = params['cedula']
      let nombres = params['nombres']
      this.CedulaC=cedula;
      this.NombreC=nombres;
      console.log(nombres)
      this.responsablepppService.getDocenteCarrerabyCedula(cedula).subscribe(value => {
        // @ts-ignore
        this.carrerasService.getCarreras().subscribe(value1 => {
          // @ts-ignore
          this.carrera = value1.filter(value2 => value2.codigo==value[0].codigo)[0].nombre
          // @ts-ignore
          this.Siglas=value1.filter(value2 => value2.codigo==value[0].codigo)[0].codigo;
        })
        // @ts-ignore
        this.responsablepppService.getResposablepppbyCarrera(value[0].codigo).subscribe(data=>{
          this.proyecto.responsablePPP=data.nombres_completo;
        },()=>{

        })
      })
    })
    this.fechaService.getSysdate().subscribe(value => {
      this.Fechaat=value.fecha;
      this.Fechaat=value.fecha;
    })
    this.rows.push(this.createItemFormGroup());
    this.firstFormGroup = this._formBuilder.group({
      nombre: ['', Validators.required],
      programa: ['', Validators.required],
      alcance:['', Validators.required],
      linea: ['', Validators.required],
      proyecto: ['', Validators.required],
      estado: ['', Validators.required],
      plazo: ['', Validators.required],
      start: ['', Validators.required],
      end: ['', Validators.required],
    });
    this.secondFormGroup = this._formBuilder.group({
      objetivo: ['', Validators.required],
    });
    this.thirdFormGroup = this._formBuilder.group({
      director: ['', Validators.required],
    });
    this.fourFormGroup = this._formBuilder.group({
      documento:['', Validators.required],
    });
    // @ts-ignore
    this.secondFormGroup.get("items_value")?.setValue("yes");
    // @ts-ignore
    this.secondFormGroup.addControl('rows', this.rows);
  }
  filter(value: any): Docentes[] {
    const filterValue = value.toString().toLowerCase();
    return this.docentes.filter(option => option.nombres_completo?.toLowerCase().includes(filterValue)
      ||option.titulo?.toLocaleLowerCase().includes(filterValue)
      ||option.cedula?.toLocaleLowerCase().includes(filterValue)
      ||option.docente_tipo_tiempo?.toLocaleLowerCase().includes(filterValue)
    );
  }
  filter0(value: any): Docentes[] {
    const filterValue = value.toString().toLowerCase();
    return this.docentes.filter(option => option.nombres_completo?.toLowerCase().includes(filterValue)
      ||option.titulo?.toLocaleLowerCase().includes(filterValue)
      ||option.cedula?.toLocaleLowerCase().includes(filterValue)
      ||option.docente_tipo_tiempo?.toLocaleLowerCase().includes(filterValue)
    ).slice(0,10);
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
    this.obtnerDatos();
    console.log(this.docentesselectApoyo)
  }
  removeApoyo(docente:Docentes){
    this.docentesselectApoyo.forEach((element,index)=>{
      if(element.cedula==docente.cedula) this.docentesselectApoyo.splice(index,1);
    });
    this.obtnerDatos();
    console.log(this.docentesselectApoyo)
  }

  public displayDedicacion (dedicacionSel:Docentes): string {
    if (dedicacionSel != null && dedicacionSel.nombres_completo!="null"){
      return dedicacionSel.nombres_completo+"";
    }else{
      return "";
    }
  }

  docentesAnexo1: Anexo1 = new Anexo1();
  obtnerDatos(){
    console.log( this.docentesAnexo1.nombreCarrera)
    this.anexo1.length=0;
    this.docentesselectApoyo.forEach(value => {
      this.docentesAnexo1 = new Anexo1();
      this.docentesAnexo1.docenteTitulo=value.titulo;
      this.docentesAnexo1.documento=""
      this.docentesAnexo1.cedulaDelegado=value.cedula;
      this.docentesAnexo1.nombreDelegado=value.nombres_completo;
      this.docentesAnexo1.nombreRol="apoyo"
      this.docentesAnexo1.cedulaCoordinador=this.CedulaC;
      this.docentesAnexo1.nombreCoordinador=this.NombreC;
      this.docentesAnexo1.siglasCarrera=this.Siglas;
      this.docentesAnexo1.nombreCarrera=this.carrera;
      this.docentesAnexo1.fechaDelegacion=this.Fechaat;
      this.docentesAnexo1.nombreProyecto=this.proyecto.nombre;
      this.anexo1.push(this.docentesAnexo1)
    })
    this.docentesAnexo1 = new Anexo1();
    this.docentesAnexo1.docenteTitulo=this.docentesselectDirector.titulo;
    this.docentesAnexo1.documento=""
    this.docentesAnexo1.cedulaDelegado=this.docentesselectDirector.cedula;
    this.docentesAnexo1.nombreDelegado=this.docentesselectDirector.nombres_completo;
    this.docentesAnexo1.nombreRol="director"
    this.docentesAnexo1.cedulaCoordinador=this.CedulaC;
    this.docentesAnexo1.nombreCoordinador=this.NombreC;
    this.docentesAnexo1.siglasCarrera=this.Siglas;
    this.docentesAnexo1.nombreCarrera=this.carrera;
    this.docentesAnexo1.fechaDelegacion=this.Fechaat;
    this.docentesAnexo1.nombreProyecto=this.proyecto.nombre;
    this.anexo1.push(this.docentesAnexo1)
    console.log(this.anexo1)
  }
  selectionDirector(director: MatSelectionListChange){
    this.docentesselectDirector=director.option.value
    this.obtnerDatos();
    console.log(this.docentesselectDirector.nombres_completo)
  }

  generarDocumento(anexo1:Anexo1,file:FileList){
    console.log(anexo1);
    console.log(file[0])
    getBase64(file[0]).then(docx=>{
      this.anexo1.forEach(value => {
        if (value.cedulaDelegado==anexo1.cedulaDelegado){
          value.documento=docx+"";
        }
      })
    })
  }

  guardar(proyectos:Proyectos){
    proyectos.objetivosEspecificosProyecto=this.rows.getRawValue();
    console.log(this.proyecto);
  }

  generate(anexo1: Anexo1) {
    console.log(anexo1.nombreCoordinador);
    loadFile("https://raw.githubusercontent.com/Sbryan20/Sistema-PPProfesionales/main/src/assets/doc/anexo1.docx", function(
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
        fecha: anexo1.fechaDelegacion,
        titulo: anexo1.docenteTitulo,
        nombre_docente: anexo1.nombreDelegado,
        nombre_carrera: anexo1.nombreCarrera,
        delegacion:anexo1.nombreRol,
        nombre_proyecto: anexo1.nombreProyecto,
        nombre_coordinador:anexo1.nombreCoordinador,
        siglas:anexo1.siglasCarrera,
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
      saveAs(out, "Anexo1 "+anexo1.nombreRol+" "+anexo1.nombreDelegado+".docx");
    });
  }


}


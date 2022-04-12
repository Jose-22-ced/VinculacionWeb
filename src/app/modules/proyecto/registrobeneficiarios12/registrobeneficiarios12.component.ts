import { Component, OnInit } from '@angular/core';
import {FormArray, FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {MatSelectionListChange} from "@angular/material/list";
import {Anexo7} from "../../../models/anexo7";
import {Proyectos} from "../../../models/proyectos";
import {ProyectoService} from "../../../services/proyecto.service";
import {map, Observable, startWith} from "rxjs";
import {ActivatedRoute} from "@angular/router";
import {EntidadbeneficiarioService} from "../../../services/entidadbeneficiario.service";
import {Entidadbeneficiaria} from "../../../models/entidadbeneficiaria";
import {Anexo12} from "../../../models/anexo12";
import {Anexo12Service} from "../../../services/anexo12.service";
import {Anexo61} from "../../../models/anexo61";
import {DatePipe} from "@angular/common";
import Docxtemplater from "docxtemplater";
// @ts-ignore
import PizZip from "pizzip";
// @ts-ignore
import PizZipUtils from "pizzip/utils/index.js";
// @ts-ignore
import { saveAs } from "file-saver";
import Swal from "sweetalert2";


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
  selector: 'app-registrobeneficiarios12',
  templateUrl: './registrobeneficiarios12.component.html',
  styleUrls: ['./registrobeneficiarios12.component.css']
})
export class Registrobeneficiarios12Component implements OnInit {
  issloading=true;
  isLinear = true;
  isexist?:boolean;
  rows: FormArray;
  rowsP: FormArray;
  cedula?: String;
  nombres?:String;
  anexo12es: Anexo12 = new Anexo12();
  //grupos
  firstFormGroup?: FormGroup;
  secondFormGroup?: FormGroup;
  thirdFormGroup?: FormGroup;
  fourFormGroup?: FormGroup;
  myControl = new FormControl();

  proyectos:Proyectos[]=[];
  proyectoSelect:Proyectos=new Proyectos();
  filteredOptions?: Observable<Proyectos[]>;
  filteredOptionsP?: Observable<Proyectos[]>;
  entidadSelect:Entidadbeneficiaria=new Entidadbeneficiaria();

  constructor(private _formBuilder: FormBuilder,
              private activatedRoute: ActivatedRoute,
              private proyectoService: ProyectoService,
              private entidadService: EntidadbeneficiarioService,
              private anexo12Service: Anexo12Service) {
    this.secondFormGroup=this._formBuilder.group({
      items:[null,Validators.required],
    items_value:['no',Validators.required]})
    this.rows = this._formBuilder.array([]);

    this.fourFormGroup = this._formBuilder.group({
      items: [null, Validators.required],
      items_value: ['no', Validators.required]

    });
    this.rowsP = this._formBuilder.array([]);
  }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params=>{
      let id=params['id']
      let cedula=params['cedula']
      let nombres=params['nombres']
      this.nombres=nombres
      this.cedula=cedula

      this.proyectoService.getProyectosCICedulaAp(cedula).subscribe(dataPro=>{
        this.proyectos=dataPro
        this.filteredOptionsP = this.myControl.valueChanges.pipe(
          startWith(''),
          map(values => this.filterP(values)),
        );
        this.issloading = false;
      })
     /* this.proyectoService.getProyectobyCIApoyo(cedula).subscribe(dataPro=>{
        this.proyectoSelect=dataPro
        this.entidadService.getsaveEntidadBeneficiariabyId(Number(dataPro.entidadbeneficiaria)).subscribe(dataEn=>{
          this.entidadSelect=dataEn
          this.filteredOptions= this.myControl.valueChanges.pipe(
            startWith(''),
            map(values => this.filter(values)),
          );
          this.issloading = false;
        })
      })*/

    })


    this.firstFormGroup = this._formBuilder.group({
      fecha: ['', Validators.required],
    });
    this.secondFormGroup = this._formBuilder.group({});
    this.secondFormGroup.addControl('rows',this.rows);
    this.thirdFormGroup = this._formBuilder.group({
      docx: ['', Validators.required],
    });
    this.fourFormGroup = this._formBuilder.group({
      proyecto: ['', Validators.required],
    });
  }
  filter(value: any): Proyectos[] {
    const filterValue = value.toString().toLowerCase();
    return this.proyectos.filter(option => option.nombre?.toLowerCase().includes(filterValue)
      || option.nombredirector?.toLocaleLowerCase().includes(filterValue)
    );
  }
  filterP(value: any): Proyectos[] {
    const filterValue = value.toString().toLowerCase();
    return this.proyectos.filter(option => option.nombre?.toLowerCase().includes(filterValue)
    );
  }

  selectionProyecto(proyecto: MatSelectionListChange){
    this.proyectoSelect=proyecto.option.value
    this.entidadService.getsaveEntidadBeneficiariabyId(Number(this.proyectoSelect.entidadbeneficiaria)).subscribe(dataEn=>{
      this.entidadSelect=dataEn
      this.filteredOptions= this.myControl.valueChanges.pipe(
        startWith(''),
        map(values => this.filter(values)),
      );
      this.issloading = false;
    })

  }

  onAddRow() {
    this.rows.push(this.createItemFormGroup());
    console.log(this.rows.getRawValue())
  }
  onRemoveRow(rowIndex: number) {
    this.rows.removeAt(rowIndex);
  }
  createItemFormGroup(): FormGroup {
    return this._formBuilder.group({
      nombresCompletos: ['', Validators.required],
      cedula: ['', Validators.required],

      observaciones: ['', Validators.required],
    });
  }

  anexo12Ob: Anexo12 = new Anexo12();
  obtenerDatos(){
    this.anexo12Ob.nombreProyecto=this.proyectoSelect.nombre;
    this.anexo12Ob.entidadBeneficiaria=this.entidadSelect.nombre;
    this.anexo12Ob.repreentanteEntidad=this.entidadSelect.representante;
    this.anexo12Ob.telefonoEntidad=this.entidadSelect.telefonoEntidad;
    this.anexo12Ob.emailRepresentanteEntidad=this.entidadSelect.emailRepresentante;
    this.anexo12Ob.actividadesAnexo12=this.rows.getRawValue();
    this.anexo12Ob.nombreApoyo=this.nombres;
    this.anexo12Ob.nombreAdministrador=this.entidadSelect.representante;
    this.anexo12Ob.idProyectoPPP=this.proyectoSelect.id;
    this.anexo12Ob.cedulaApoyo=this.cedula;
    return this.anexo12Ob;
  }
  guardarAnexo12(){
    var anexo12=this.obtenerDatos();
    this.anexo12Service.saveAnexo(anexo12).subscribe(value => {
      console.log(anexo12)
      Swal.fire({
        title: 'Exito',
        text: 'Anexo12 creado',
        icon: 'success',
        iconColor :'#17550c',
        color: "#0c3255",
        confirmButtonColor:"#0c3255",
        background: "#fbc02d",
      })
    },error => {
      Swal.fire({
        title: 'Error',
        text: 'anexo 12 no se creado '+error.error.message,
        icon: 'error',
        color: "#0c3255",
        confirmButtonColor:"#0c3255",
        background: "#fbc02d",
      })
    })
  }
  subirDocumento12(file:FileList){
    if(file.length==0){
    }else{
      getBase64(file[0]).then(docx=>{
        // @ts-ignore
        console.log(docx.length)
        // @ts-ignore
        if(docx.length>=10485760){
          this.anexo12Ob.documento="";
          Swal.fire(
            'Fallo',
            'El documento excede el peso permitido',
            'warning'
          )
        }else{
          this.anexo12Ob.documento=docx+"";
        }
      })
    }
  }
  generarDocumento12() {
    var anexo12:Anexo12=this.obtenerDatos();
    console.log(anexo12)
    var pipe:DatePipe = new DatePipe('en-US')
    loadFile("https://raw.githubusercontent.com/Jose-22-ced/VinculacionWeb/master/src/assets/docs/anexo12.docx", function(
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
        nombreProyecto:anexo12.nombreProyecto,
        fechaCapacitacion:pipe.transform(anexo12.fechaCapacitacion,'dd/MM/yyyy'),
        horasCapacitacion:anexo12.horasCapacitacion,
        entidadBeneficiaria:anexo12.entidadBeneficiaria,
        repreentanteEntidad:anexo12.repreentanteEntidad,
        telefonoEntidad:anexo12.telefonoEntidad,
        emailRepresentanteEntidad:anexo12.emailRepresentanteEntidad,
        asuntoCapacitacion:anexo12.asuntoCapacitacion,

        tb:anexo12.actividadesAnexo12,
        nombreAdministrador:anexo12.nombreAdministrador,
        nombreApoyo:anexo12.nombreApoyo
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
      saveAs(out, "Anexo12.docx");
    });
  }

}

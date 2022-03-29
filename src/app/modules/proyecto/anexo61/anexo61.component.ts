import {AfterViewInit, Component, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {ActivatedRoute} from "@angular/router";
import {map, Observable, startWith} from "rxjs";
import {Anexo61Service} from "../../../services/anexo61.service";
import {Actividades, Anexo61} from "../../../models/anexo61";
import {FechaService} from "../../../services/fecha.service";
import Swal from "sweetalert2";
import {Anexo6} from "../../../models/anexo6";
import {Anexo6Service} from "../../../services/anexo6.service";
import {Anexo3Service} from "../../../services/anexo3.service";
import {ProyectoService} from "../../../services/proyecto.service";
import {MatSelectionListChange} from "@angular/material/list";
import {DatePipe} from "@angular/common";
import Docxtemplater from "docxtemplater";

// @ts-ignore
import PizZip from "pizzip";
// @ts-ignore
import PizZipUtils from "pizzip/utils/index.js";
// @ts-ignore
import { saveAs } from "file-saver";
import {Anexo62} from "../../../models/anexo62";

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
  selector: 'app-anexo61',
  templateUrl: './anexo61.component.html',
  styleUrls: ['./anexo61.component.css']
})
export class Anexo61Component implements OnInit,AfterViewInit {
  isLinear = true;
  panelOpenState = true;
  issloading = true;
  isexist?: boolean;
  actualzar=false
  //ArrayActividadesEstudiante
  rows: FormArray;
  itemForm?: FormGroup;
//secuenciasdepantallas
  firstFormGroup?: FormGroup;
  secondFormGroup?: FormGroup;
  fourFormGroup?: FormGroup;
//anexo6.1
  anexo61: Anexo61[] = []
  anexo61es: Anexo61 = new Anexo61();
  seleccionanexos61: Anexo61[] = [];
  anexo61requeste:Anexo61=new Anexo61;
//anexo6
  anexo6: Anexo6[] = []
  anexo6es: Anexo6 = new Anexo6();
  seleccionanexos6: Anexo6[] = [];
  anexo6select: Anexo6 = new Anexo6();
  anexo6requeste:Anexo6=new Anexo6;
//filtros
  myControl = new FormControl();
  filteredOptions?: Observable<Anexo6[]>;
  cedula?: String;
  nombre?: String;

  ceduladir?: String;
  nombredir?: String;
  Fechaenvio?: Date;


  constructor(private fechaService: FechaService, private anexo6Service: Anexo6Service, private activatedRoute: ActivatedRoute,
              private anexo61Service: Anexo61Service, private anexo3Service: Anexo3Service, private proyectoService: ProyectoService,
              private _formBuilder: FormBuilder) {

    this.secondFormGroup = this._formBuilder.group({
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
    this.obtnerdatos();
    this.activatedRoute.params.subscribe(params => {
      let cedula = params['cedula']
      let nombre = params['nombrescompletos']
      this.nombre = nombre;
      console.log(cedula)
      this.anexo61Service.getAnexo61_porid(0).subscribe(value => {
        this.anexo61es = value
        if (value.actividades?.length == 0) {
          this.onAddRow("");
        }
        value.actividades?.forEach(value1 => {
          this.onAddRow("");
        })
      })
      this.anexo6Service.getAnexo6all().subscribe(data => {
        this.anexo6 = data;
        console.log(data);
        this.filteredOptions = this.myControl.valueChanges.pipe(
          startWith(''),
          map(values => this.filter(values)),
        );
        this.issloading = false;
      })
      this.fechaService.getSysdate().subscribe(value => {
        this.Fechaenvio = value.fecha;
        this.Fechaenvio = value.fecha;
      })
    })
    this.firstFormGroup = this._formBuilder.group({
      anexo6: ['', Validators.required],
    });
    this.secondFormGroup = this._formBuilder.group({});
    this.fourFormGroup = this._formBuilder.group({
      docx: ['', Validators.required],
    });
    //ArrayActividades
    this.secondFormGroup.get("items_value")?.setValue("yes");
    this.secondFormGroup.addControl('rows', this.rows);
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

    this.anexo6select.actividades?.forEach(value1 => {
      this.onAddRow(value1.actividad+"")
    })
    this.obtnerdatos();
  }

  onAddRow(actividad:String) {
    this.rows.push(this.createItemFormGroup(actividad));
    console.log(this.rows.getRawValue())
  }
  onRemoveRow(rowIndex: number) {
    this.rows.removeAt(rowIndex);
  }
  createItemFormGroup(actividad:String): FormGroup {
    return this._formBuilder.group({
      actividadesEstudiante: [actividad, Validators.required],
      controlEstudiante: ['', Validators.required],
      desempenoEstudiante:['', Validators.required],
      asignaturasBase: ['', Validators.required],
    });
  }


  anexoss61: Anexo61 = new Anexo61();
  obtnerdatos(){
    this.anexoss61.idProyecto = this.anexo6select.proyectoId;
    this.anexoss61.nombreApoyo = this.anexo6select.nombreDocenteApoyo;
    this.anexoss61.fechaApoyo=this.Fechaenvio;
    this.anexoss61.fechaDirector=this.Fechaenvio;
    this.anexo61Service.getDocentedirector(this.anexo6select.proyectoId).subscribe(value => {
      this.nombredir = value.nombre + " " + value.apellidos
      this.ceduladir = value.cedula;
    })
    this.anexoss61.cedulaDirector=this.ceduladir;
    this.anexoss61.nombreDirector=this.nombredir;
    this.anexoss61.actividades = this.rows.getRawValue();
    return this.anexoss61;
  }


  agregarActividades() {
    this.anexo61Service.saveAnexo61(this.obtnerdatos()).subscribe(data => {
      console.log(data)
      Swal.fire({
        title: 'Exito',
        text: 'guardado',
        icon: 'success',
        iconColor: '#17550c',
        color: "#0c3255",
        confirmButtonColor: "#0c3255",
        background: "#fbc02d",
      })
    }, error => {
      Swal.fire({
        title: 'Fallo',
        text: '' + error.error.message,
        icon: 'error',
        color: "#0c3255",
        confirmButtonColor: "#0c3255",
        background: "#fbc02d",
      })
    })
  }

  generardoc(){
    console.log(this.obtnerdatos())
  }

  generarDocumento(anexo61:Anexo61) {
    var pipe:DatePipe = new DatePipe('en-US')
    loadFile("https://raw.githubusercontent.com/Jose-22-ced/VinculacionWeb/master/src/assets/docs/anexo6.1.docx", function(
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
      saveAs(out, "Anexo6_1.docx");
    });
  }}

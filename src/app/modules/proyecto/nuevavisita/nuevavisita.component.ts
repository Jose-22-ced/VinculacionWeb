import { Component, OnInit } from '@angular/core';
import {UntypedFormArray, UntypedFormBuilder, UntypedFormGroup, Validators} from "@angular/forms";
import {FechaService} from "../../../services/fecha.service";
import {CarrerasService} from "../../../services/carreras.service";
import {ActivatedRoute, Router} from "@angular/router";
import {EntidadbeneficiarioService} from "../../../services/entidadbeneficiario.service";
import {Anexo61Service} from "../../../services/anexo61.service";
import {Anexo1Service} from "../../../services/anexo1.service";
import {Anexo5Service} from "../../../services/anexo5.service";
import {Anexo1} from "../../../models/anexo1";
import {Anexo5} from "../../../models/anexo5";
import {ProyectoService} from "../../../services/proyecto.service";
import {Proyectos} from "../../../models/proyectos";
import {Entidadbeneficiaria} from "../../../models/entidadbeneficiaria";
import {Anexo13, EstudiantesVisitaRequest, InformeVisitaRequest} from "../../../models/anexo13";
import {Anexo2Service} from "../../../services/anexo2.service";
import {ResponsablepppService} from "../../../services/responsableppp.service";
import {Anexo13Service} from "../../../services/anexo13.service";
import Swal from "sweetalert2";
import {Anexo4Service} from "../../../services/anexo4.service";
import {Anexo4} from "../../../models/anexo4";

@Component({
  selector: 'app-nuevavisita',
  templateUrl: './nuevavisita.component.html',
  styleUrls: ['./nuevavisita.component.css']
})
export class NuevavisitaComponent implements OnInit {


  minDate: Date | undefined = new Date();

  anexo1:Anexo1 = new Anexo1();
  anexo5:Anexo5= new Anexo5();
  proyecto:Proyectos= new Proyectos();
  entidad:Entidadbeneficiaria = new Entidadbeneficiaria();
  isexist?:boolean=true;
  issloading=true;

  anexo4:Anexo4[]=[];

  Informe:InformeVisitaRequest=new InformeVisitaRequest();

  // @ts-ignore
  addForm: UntypedFormGroup;
  rows: UntypedFormArray;



  constructor(private _formBuilder: UntypedFormBuilder,
              private fechaService:FechaService,private carrerasService:CarrerasService,
              private activatedRoute: ActivatedRoute,
              private entidadbeneficiarioService:EntidadbeneficiarioService,
              private anexo5Service:Anexo5Service,
              private anexo1Service:Anexo1Service,
              private router:Router,
              private proyectoService:ProyectoService,
              private anexo2Service:Anexo2Service,
              private responsablepppService:ResponsablepppService,
              private anexo13Service:Anexo13Service,
              private anexo4Service:Anexo4Service) {
    //ArrayActividades
    this.addForm = this._formBuilder.group({
    });
    this.rows = this._formBuilder.array([]);
  }

  ngOnInit(): void {
    this.fechaService.getSysdate().subscribe(value => {
      this.minDate=value.fecha;
    })
    this.activatedRoute.params.subscribe(params => {
      let cedula = params['cedula']
      this.anexo1Service.getAnexo1byCedula(cedula).subscribe(value => {
        this.anexo1=value[value.length-1]
        this.anexo4Service.getAnexo4All().subscribe(value2 => {
          this.anexo4=value2.filter(value3 => value3.idProyectoPPP==this.anexo1.idProyectoPPP&&value3.num_proceso==2)
          this.proyectoService.getProyectobyid(Number(this.anexo1.idProyectoPPP)).subscribe(value2 => {
            this.proyecto=(value2.estado==true)?value2:new Proyectos();
            if(value2.estado==false){
              Swal.fire({
                title: 'Vacío',
                text: 'No existen proyectos actualmente',
                icon: 'info',
                iconColor :'#17550c',
                color: "#0c3255",
                background: "#fbc02d",
              })
            }
            this.entidadbeneficiarioService.getsaveEntidadBeneficiariabyId(Number(this.proyecto.entidadbeneficiaria)).subscribe(value3 => {
              this.entidad=value3
              this.anexo2Service.getAnexoByidProyecto(Number(this.anexo1.idProyectoPPP)).subscribe(value4 => {
                this.anexo13.ciclo=value4.ciclo;
                this.responsablepppService.getResposablepppbyCarrera(value4.siglasCarrera+'').subscribe(value5 => {
                  this.anexo13.periodoAcademicon=value5.fecha_inicio_periodo+" "+value5.fecha_fin_periodo;
                  this.anexo13Service.getAnexo13by(Number(this.anexo1.idProyectoPPP)).subscribe(value6 => {
                    if(value6.length==0){
                      this.onAddRow(this.Informe)
                      this.issloading=false;
                    }else {
                      this.anexo13=value6[0];
                      // @ts-ignore
                      value6[0].informes.forEach(value7 => {
                        this.issloading=false;
                        this.onAddRow(value7)
                      })
                    }

                  })
                })
              })
            })
          })
        })
      })
    })
    this.addForm.get("items_value")?.setValue("yes");
    this.addForm.addControl('rows', this.rows);
  }

  //ArrayActividades
  onAddRow(informeVisitaRequest:InformeVisitaRequest) {
    this.rows.push(this.createItemFormGroup(informeVisitaRequest));
  }
  onRemoveRow(rowIndex:number){
    this.rows.removeAt(rowIndex);
  }
  createItemFormGroup(informeVisitaRequest:InformeVisitaRequest): UntypedFormGroup {
    return this._formBuilder.group({
      id:informeVisitaRequest.id,
      asunto:[informeVisitaRequest.asunto, Validators.required],
      actividades:[informeVisitaRequest.actividades, Validators.required],
      observaciones:[informeVisitaRequest.observaciones, Validators.required],
      horaInicio:[informeVisitaRequest.horaInicio, Validators.required],
      horaFin:[informeVisitaRequest.horaFin, Validators.required],
      fecha:[informeVisitaRequest.fecha, Validators.required],
    });
  }

  anexo13:Anexo13=new Anexo13();
  estudiantesVisitaRequest:EstudiantesVisitaRequest[]=[];
  obtnerDatos():Anexo13{
    this.estudiantesVisitaRequest.length=0;
    this.anexo4.forEach(value => {
      this.estudiantesVisitaRequest.push({
        cedula:value.cedulaEstudiante,
        nombre:value.nombreEstudiante,
      })
    })
    this.anexo13.cedulaDirectorDocenteApoyo=this.anexo1.cedulaDelegado;
    this.anexo13.nombreDirectorDocenteApoyo=this.anexo1.nombreDelegado;
    this.anexo13.empresa=this.entidad.nombre;
    this.anexo13.proyectoId=this.proyecto.id;
    this.anexo13.representanteLegal=this.entidad.representante;
    this.anexo13.estudiantesVisitas=this.estudiantesVisitaRequest;
    this.anexo13.informes=this.rows.getRawValue()
    return this.anexo13;
  }

  guardarAnexo13(){
    //console.log(this.obtnerDatos())
    this.anexo13Service.saveAnexo13(this.obtnerDatos()).subscribe(value => {
      Swal.fire({
        title: 'Exito',
        text: 'Vista guardada correctemente, puede ir el apartado de "Ver vistas" y obtner el anexo actualizado',
        icon: 'success',
        iconColor :'#17550c',
        color: "#0c3255",
        confirmButtonColor:"#0c3255",
        background: "#fbc02d",
      })
    },error => {
      Swal.fire({
        title: 'Error',
        text: 'No nose guardo la vista ' + error.error.message,
        icon: 'error',
        iconColor :'#17550c',
        color: "#0c3255",
        confirmButtonColor:"#0c3255",
        background: "#fbc02d",
      })
    })

  }

}

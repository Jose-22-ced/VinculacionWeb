import { Component, OnInit } from '@angular/core';
import {UntypedFormBuilder, UntypedFormControl} from "@angular/forms";
import {map, Observable, startWith} from "rxjs";
import {FechaService} from "../../../services/fecha.service";
import {CarrerasService} from "../../../services/carreras.service";
import {ActivatedRoute, Router} from "@angular/router";
import Swal from "sweetalert2";
import {Anexo62} from "../../../models/anexo62";
import {Anexo62Service} from "../../../services/anexo62.service";

@Component({
  selector: 'app-veranexo62',
  templateUrl: './veranexo62.component.html',
  styleUrls: ['./veranexo62.component.css']
})
export class Veranexo62Component implements OnInit {


  issloading=true;
  isexist?:boolean
  panelOpenState = false;
  myControl = new UntypedFormControl();
  filteredOptions?: Observable<Anexo62[]>;
  cedula?:String;
  nombre?:String;
  anexos62:Anexo62[]=[];

  constructor(private fechaService:FechaService,private carrerasService:CarrerasService,
              private activatedRoute: ActivatedRoute,private _formBuilder: UntypedFormBuilder,
              private anexo62Service:Anexo62Service,
              private router:Router) {

  }
  ngOnInit(): void {

    this.activatedRoute.params.subscribe(params => {
      let cedula = params['cedula']
      let nombre = params['nombres']
      this.nombre = nombre;
      // console.log(cedula)
      this.anexo62Service.getAnexo6().subscribe(anex62 => {
        this.anexos62=anex62.filter(value => value.nombreApoyo==nombre);
        this.isexist=anex62.length!=0;
        this.issloading=false;
        this.filteredOptions = this.myControl.valueChanges.pipe(
          startWith(''),
          map(values=>this.filter(values)),
        );
        // console.log( this.anexos62)
      })
    })

  }

  ngAfterViewInit(): void {
    setTimeout(()=>{
    },1000)
  }

  filter(value: any): Anexo62[] {
    const filterValue = value.toLowerCase();
    return this.anexos62.filter(option => option.cedulaDirector?.toLowerCase().includes(filterValue)
      ||option.nombreDirector?.toLocaleLowerCase().includes(filterValue)
      ||option.nombreApoyo?.toLocaleLowerCase().includes(filterValue)
      || option.cedulaEstudiante?.toLocaleLowerCase().includes(filterValue)
      || option.ciclo?.toLocaleLowerCase().includes(filterValue)
      || option.nombreEstudiante?.toLocaleLowerCase().includes(filterValue)
    );
  }

  eliminarAnexo62(anexo62:Anexo62){
    Swal.fire({
      title: 'Seguro?',
      text: "Está por eliminar el anexo 6.1 : "+anexo62.id,
      icon: 'warning',
      showCancelButton: true,
      color: "#0c3255",
      confirmButtonColor:"#0c3255",
      background: "#fbc02d",
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, Eliminar!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.issloading=true;
        console.log(Number(anexo62.id))
        this.anexo62Service.deleteAnexo62(anexo62.id).subscribe(value => {
          Swal.fire({
            title: 'Eliminado',
            text: 'El proyecto se elimino correctamente',
            icon: 'success',
            iconColor :'#17550c',
            color: "#0c3255",
            confirmButtonColor:"#0c3255",
            background: "#fbc02d",
          })
          window.location.reload();
        },error => {
          Swal.fire({
            title: 'Error',
            text: 'Hubo un error al eliminar el proyecto '+error.error.message,
            icon: 'warning',
            color: "#0c3255",
            confirmButtonColor:"#0c3255",
            background: "#fbc02d",
          })
        })
        window.location.reload();
      }
      this.issloading=false;
    })
  }
}

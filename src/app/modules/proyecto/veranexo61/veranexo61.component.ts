import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormControl} from "@angular/forms";
import {map, Observable, startWith} from "rxjs";
import {Proyectos} from "../../../models/proyectos";
import {FechaService} from "../../../services/fecha.service";
import {CarrerasService} from "../../../services/carreras.service";
import {ResponsablepppService} from "../../../services/responsableppp.service";
import {ActivatedRoute, Router} from "@angular/router";
import {EntidadbeneficiarioService} from "../../../services/entidadbeneficiario.service";
import {ProyectoService} from "../../../services/proyecto.service";
import {Anexo1Service} from "../../../services/anexo1.service";
import Swal from "sweetalert2";
import {Anexo61} from "../../../models/anexo61";
import {Anexo61Service} from "../../../services/anexo61.service";

@Component({
  selector: 'app-veranexo61',
  templateUrl: './veranexo61.component.html',
  styleUrls: ['./veranexo61.component.css']
})
export class Veranexo61Component implements OnInit {


  issloading=true;
  isexist?:boolean
  panelOpenState = false;
  myControl = new FormControl();
  filteredOptions?: Observable<Anexo61[]>;
  cedula?:String;
  nombre?:String;
  anexos61:Anexo61[]=[];

  constructor(private fechaService:FechaService,private carrerasService:CarrerasService,
              private activatedRoute: ActivatedRoute,private _formBuilder: FormBuilder,
              private entidadbeneficiarioService:EntidadbeneficiarioService,
              private anexo61Service:Anexo61Service,
              private anexo1Service:Anexo1Service,
              private router:Router) {

  }
  ngOnInit(): void {

    this.activatedRoute.params.subscribe(params => {
      let cedula = params['cedula']
      let nombre = params['nombres']
      this.nombre = nombre;
      console.log(cedula)
      this.anexo61Service.getAnexo6().subscribe(anex61 => {
        this.anexos61=anex61.filter(value => value.nombreApoyo==nombre);
        console.log(nombre)
        this.isexist=anex61.length!=0;
        this.issloading=false;
        this.filteredOptions = this.myControl.valueChanges.pipe(
          startWith(''),
          map(values=>this.filter(values)),
        );
        console.log( this.anexos61)
      })
    })





  }


  // ngOnInit(): void {
  //   this.activatedRoute.params.subscribe(params => {
  //     let cedula = params['cedula']
  //     let nombre = params['nombrescompletos']
  //     this.nombre = nombre;
  //     console.log(cedula)
  //   })
  //   this.anexo61Service.getAnexo6().subscribe(anex61 => {
  //     console.log(anex61)
  //     // @ts-ignore
  //     this.isexist=anex61.filter(value1 => value1.nombreApoyo==value[0].nombreApoyo).length!=0;
  //     // @ts-ignore
  //     this.anexos61=anex61.filter(value1 => value1.nombreApoyo==value[0].nombreApoyo);
  //     this.issloading=false;
  //     this.filteredOptions = this.myControl.valueChanges.pipe(
  //       startWith(''),
  //       map(values=>this.filter(values)),
  //     );
  //     console.log(this.anexos61)
  //   })
  //   }

  ngAfterViewInit(): void {
    setTimeout(()=>{
    },1000)
  }

  filter(value: any): Anexo61[] {
    const filterValue = value.toLowerCase();
    return this.anexos61.filter(option => option.cedulaDirector?.toLowerCase().includes(filterValue)
      ||option.nombreDirector?.toLocaleLowerCase().includes(filterValue)
      ||option.nombreApoyo?.toLocaleLowerCase().includes(filterValue)
    );
  }

  eliminarAnexo61(anexo61:Anexo61){
    Swal.fire({
      title: 'Seguro?',
      text: "Está por eliminar el anexo 6.1 : "+anexo61.id,
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
        console.log(Number(anexo61.id))
        this.anexo61Service.deleteAnexo61(anexo61.id).subscribe(value => {
          Swal.fire({
            title: 'Eliminado',
            text: 'El proyecto se elimino correctamente',
            icon: 'success',
            iconColor :'#17550c',
            color: "#0c3255",
            confirmButtonColor:"#0c3255",
            background: "#fbc02d",
          })
          this.router.navigate(['/panelusuario/proyectovinculacion/veranexos6_1',this.cedula,this.nombre]);
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
      }
      this.issloading=false;
    })
  }
}


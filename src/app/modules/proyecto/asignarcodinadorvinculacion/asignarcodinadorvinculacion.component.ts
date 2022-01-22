import { Component, OnInit } from '@angular/core';
import Swal from "sweetalert2";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {CordinadorVinculacion} from "../../../models/cordinadorvinculacion";
import {map, Observable, startWith} from "rxjs";
import {Router} from "@angular/router";
import {MatSelectionListChange} from "@angular/material/list";
import {CordinadorvinculacionService} from "../../../services/cordinadorvinculacion.service";

@Component({
  selector: 'app-asignarcodinadorvinculacion',
  templateUrl: './asignarcodinadorvinculacion.component.html',
  styleUrls: ['./asignarcodinadorvinculacion.component.css']
})
export class AsignarcodinadorvinculacionComponent implements OnInit {
  issloading=true;
  isexist?:boolean;
  isLinear = true;
  myControl = new FormControl();
  firstFormGroup: FormGroup |  null= null;
  secondFormGroup: FormGroup | null= null
  cordinador:CordinadorVinculacion[]=[];
  cordinadorselect:CordinadorVinculacion=new CordinadorVinculacion();
  filteredOptions?: Observable<CordinadorVinculacion[]>;
  typesOfShoes: string[] = ['Boots', 'Clogs', 'Loafers', 'Moccasins', 'Sneakers'];

  constructor(private router: Router,private _formBuilder: FormBuilder, private fb: FormBuilder,private cordinadorvinculacionService:CordinadorvinculacionService) { }

  ngOnInit(): void {
    this.firstFormGroup = this._formBuilder.group({
      firstCtrl: ['', Validators.required],
    });
    this.secondFormGroup = this._formBuilder.group({
      secondCtrl: ['', Validators.required],
    });
    this.cordinadorvinculacionService.getCordinadorVinculacion().subscribe(data=>{
      this.isexist=data.filter(value => value.estado==true).length==0
      this.cordinador=data;
      this.filteredOptions = this.myControl.valueChanges.pipe(
        startWith(''),
        map(values=>this.filter(values)),
      );
      this.issloading=false;
    })

  }
  ngAfterViewInit(): void {
    setTimeout(()=>{

    },1000)
  }

  selectionCordinador(cordinadorselect: MatSelectionListChange){
    this.cordinadorselect=cordinadorselect.option.value
    console.log(this.cordinadorselect.nombres)
  }

  filter(value: any): CordinadorVinculacion[] {
    const filterValue = value.toLowerCase();
    return this.cordinador.filter(option => option.nombres?.toLowerCase().includes(filterValue)
      ||option.apellidos?.toLocaleLowerCase().includes(filterValue)
      ||option.cedula?.toLocaleLowerCase().includes(filterValue)
      ||option.carga?.toLocaleLowerCase().includes(filterValue)
      ||option.titulo?.toLocaleLowerCase().includes(filterValue)
    );
  }


  //GuardarCordinador
  guardarcv(docente:CordinadorVinculacion):void{
    Swal.fire({
      title: 'Esta seguro?',
      text: "Al docente seleccionado como Cordinador de Vinculación",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Aceptar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.cordinadorvinculacionService.existCordinadorVinculacion(docente.cedula+"").subscribe(data=>{
          if(data==true){
           docente.estado=true;
           this.cordinadorvinculacionService.updateCordinadorVinculacion(docente).subscribe(datau=>{
             Swal.fire({
               icon: 'success',
               title: 'Asignado',
               text: 'El docente a sido Asignado!'
             })
             this.router.navigate(['/panelusuario/proyectovinculacion/vercordinadorvinculacion']);
           },err => {
             Swal.fire({
               icon: 'warning',
               title: 'Opss.',
               text: err.error().message
             })
           })
          }else{
            docente.estado=true;
            this.cordinadorvinculacionService.saveCordinadorVinculacion(docente).subscribe(datau=>{
              Swal.fire({
                icon: 'success',
                title: 'Asignado',
                text: 'El docente a sido Asignado!'
              })
              this.router.navigate(['/panelusuario/proyectovinculacion/vercordinadorvinculacion']);
            },err => {
              Swal.fire({
                icon: 'warning',
                title: 'Opss.',
                text: err.error().message
              })
            })
          }
        })
      }
    })

  }

}

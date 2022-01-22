import { Component, OnInit } from '@angular/core';
import {FechaService} from "../../../services/fecha.service";
import {ActivatedRoute, Router} from "@angular/router";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {EntidadbeneficiarioService} from "../../../services/entidadbeneficiario.service";
import {Entidadbeneficiaria} from "../../../models/entidadbeneficiaria";
import Swal from "sweetalert2";

@Component({
  selector: 'app-editarentidadbeneficiaria',
  templateUrl: './editarentidadbeneficiaria.component.html',
  styleUrls: ['./editarentidadbeneficiaria.component.css']
})
export class EditarentidadbeneficiariaComponent implements OnInit {
  isLinear = true;
  firstFormGroup?: FormGroup;
  secondFormGroup?: FormGroup;
  entidad:Entidadbeneficiaria = new Entidadbeneficiaria();

  //Validaciones
  omit_special_char(event: { charCode: any; })
  {var k;
    k = event.charCode;  //         k = event.keyCode;  (Both can be used)
    return((k >= 48 && k <= 57));
  }
  omit_max_char(event:{ target: any; })
  {var k;
    k = event.target.value.length;  //         k = event.keyCode;  (Both can be used)
    console.log(k)
    return (k <= 9);
  }

  constructor(private router: Router,private fechaService:FechaService,private activatedRoute: ActivatedRoute,private _formBuilder: FormBuilder,private entidadbeneficiarioService:EntidadbeneficiarioService) { }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe( params => {
      let id = params['id']
      console.log(id)
      this.entidadbeneficiarioService.getsaveEntidadBeneficiariabyId(id).subscribe(value => {
        this.entidad=value;
      })
    });
    this.firstFormGroup = this._formBuilder.group({
      nombre: ['', Validators.required],
      ciudad: ['', Validators.required],
      direccion: ['', Validators.required],
      telefono: ['', [Validators.required,Validators.pattern('[0-9]{7,10}')]],
      correo: ['', [Validators.required,Validators.email]],
      descripcion:['']
    });
    this.secondFormGroup = this._formBuilder.group({
      nombre: ['', Validators.required],
      cedula: ['', [Validators.required,Validators.pattern('[0-9]{10}')]],
      correo: ['', [Validators.required,Validators.email]],
      nombre1: ['', Validators.required],
      cedula1: ['', [Validators.required,Validators.pattern('[0-9]{10}')]],
      correo1: ['', [Validators.required,Validators.email]],
    });
  }

  editarEntidad(entidad:Entidadbeneficiaria){
    console.log(this.entidad)
    entidad.id=entidad.idEntidad;
    this.entidadbeneficiarioService.updateEntidadBeneficiaria(this.entidad).subscribe(data =>{
        console.log(data)
        Swal.fire({
          icon: 'success',
          title: 'Éxito',
          text: 'Entidad Actualizada',
          confirmButtonColor: "#0c3255"
        })
      this.router.navigate(['/panelusuario/proyectovinculacion/verentidadesbenefiarias']);
      },err=>{
        Swal.fire({
          icon: 'warning',
          title: 'Al parecer hubo un problema',
          text: err.error.message,
          confirmButtonColor: "#0c3255"
        })
      }
    )
  }
}

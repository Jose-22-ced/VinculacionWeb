import {AfterViewInit, Component, OnInit} from '@angular/core';
import Swal from "sweetalert2";
import {User} from "../../models/user";
import {Router} from "@angular/router";

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit,AfterViewInit {
  public foto?:string
  showFiller = false;
  panelOpenState = false;
  public persona:User=new User();
  public rolnombre:string="";
  issloading=true;
  loader='assets/images/loader.gif'

  constructor(private router:Router) { }
  ngAfterViewInit(): void {
    setTimeout(()=>{
      this.issloading=false;
    },1000)
  }

  ngOnInit(): void {
    this.persona=JSON.parse(sessionStorage['user']);
    this.foto=JSON.parse(sessionStorage['user']).urlFoto
    this.rolnombre=this.geRolName(JSON.parse(sessionStorage['user']).rol);
    sessionStorage.clear;

  }


  //Roles
  geRolName(rol:string):string{
    if(rol=="AUT"){
      return "AUTORIDAD";
    }
    if(rol=="CC"){
      return "COORDINADOR/A DE CARRERA";
    }
    if(rol=="CV"){
      return "COORDINADOR/A DE VINCULACIÓN";
    }
    if(rol=="DP"){
      return "DIRECTOR/A DE PROYECTO";
    }
    if(rol=="DA"){
      return "DOCENTE APOYO";
    }
    if(rol=="RPPP"){
      return "RESPONSABLE DE PRÁCTICAS PREPROFESIONALES";
    }
    if(rol=="EST"){
      return "ESTUDIANTE";
    }
    if(rol=="DOC"){
      return "DOCENTE";
    }
    return "Si rol";
  }
}

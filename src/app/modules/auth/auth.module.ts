import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IniciosesionComponent } from './iniciosesion/iniciosesion.component';
import {RouterModule, Routes} from "@angular/router";
import {MaterialModule} from "../../../material/material.module";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {HttpClientModule} from "@angular/common/http";
import {GoogleLoginProvider, SocialAuthServiceConfig, SocialLoginModule} from "@abacritt/angularx-social-login";


const routes: Routes = [
  {
    path: 'inicio_sesion',
    component: IniciosesionComponent
  }
];

@NgModule({
  declarations: [
    IniciosesionComponent
  ],
  exports:[RouterModule],
  imports: [
    CommonModule,
    MaterialModule,
    RouterModule.forChild(routes),
    ReactiveFormsModule,
    SocialLoginModule,
    HttpClientModule,
  ],providers: [
    {
      provide: 'SocialAuthServiceConfig',
      useValue: {
        autoLogin: false,
        providers: [
          {
            id: GoogleLoginProvider.PROVIDER_ID,
            provider: new GoogleLoginProvider(
              '928340628132-2oortvgm7g2ghc0s01bevdff53ih5cab.apps.googleusercontent.com'
            )
          }
        ]
      } as SocialAuthServiceConfig,
    }
  ]
})
export class AuthModule { }

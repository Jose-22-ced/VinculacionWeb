import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FirmarinformeaceptacionestudiantesComponent } from './firmarinformeaceptacionestudiantes.component';

describe('FirmarinformeaceptacionestudiantesComponent', () => {
  let component: FirmarinformeaceptacionestudiantesComponent;
  let fixture: ComponentFixture<FirmarinformeaceptacionestudiantesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FirmarinformeaceptacionestudiantesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FirmarinformeaceptacionestudiantesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

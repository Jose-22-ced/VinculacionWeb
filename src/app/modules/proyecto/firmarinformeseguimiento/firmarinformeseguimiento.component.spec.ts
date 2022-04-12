import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FirmarinformeseguimientoComponent } from './firmarinformeseguimiento.component';

describe('FirmarinformeseguimientoComponent', () => {
  let component: FirmarinformeseguimientoComponent;
  let fixture: ComponentFixture<FirmarinformeseguimientoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FirmarinformeseguimientoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FirmarinformeseguimientoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

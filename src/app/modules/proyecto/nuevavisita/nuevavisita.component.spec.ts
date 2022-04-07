import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NuevavisitaComponent } from './nuevavisita.component';

describe('NuevavisitaComponent', () => {
  let component: NuevavisitaComponent;
  let fixture: ComponentFixture<NuevavisitaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NuevavisitaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NuevavisitaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

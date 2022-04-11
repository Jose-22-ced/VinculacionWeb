import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FirmarinformdedeculmnacionapoyoComponent } from './firmarinformdedeculmnacionapoyo.component';

describe('FirmarinformdedeculmnacionapoyoComponent', () => {
  let component: FirmarinformdedeculmnacionapoyoComponent;
  let fixture: ComponentFixture<FirmarinformdedeculmnacionapoyoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FirmarinformdedeculmnacionapoyoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FirmarinformdedeculmnacionapoyoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

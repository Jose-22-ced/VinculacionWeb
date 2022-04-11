import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Veranexos7Component } from './veranexos7.component';

describe('Veranexos7Component', () => {
  let component: Veranexos7Component;
  let fixture: ComponentFixture<Veranexos7Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Veranexos7Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Veranexos7Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

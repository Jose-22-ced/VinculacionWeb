import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Veranexos11Component } from './veranexos11.component';

describe('Veranexos11Component', () => {
  let component: Veranexos11Component;
  let fixture: ComponentFixture<Veranexos11Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Veranexos11Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Veranexos11Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

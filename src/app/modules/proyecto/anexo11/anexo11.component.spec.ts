import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Anexo11Component } from './anexo11.component';

describe('Anexo11Component', () => {
  let component: Anexo11Component;
  let fixture: ComponentFixture<Anexo11Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Anexo11Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Anexo11Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

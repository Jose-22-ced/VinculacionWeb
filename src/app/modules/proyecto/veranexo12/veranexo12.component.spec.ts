import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Veranexo12Component } from './veranexo12.component';

describe('Veranexo12Component', () => {
  let component: Veranexo12Component;
  let fixture: ComponentFixture<Veranexo12Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Veranexo12Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Veranexo12Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

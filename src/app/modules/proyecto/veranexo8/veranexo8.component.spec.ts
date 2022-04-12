import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Veranexo8Component } from './veranexo8.component';

describe('Veranexo8Component', () => {
  let component: Veranexo8Component;
  let fixture: ComponentFixture<Veranexo8Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Veranexo8Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Veranexo8Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

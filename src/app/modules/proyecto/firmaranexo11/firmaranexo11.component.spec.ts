import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Firmaranexo11Component } from './firmaranexo11.component';

describe('Firmaranexo11Component', () => {
  let component: Firmaranexo11Component;
  let fixture: ComponentFixture<Firmaranexo11Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Firmaranexo11Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Firmaranexo11Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

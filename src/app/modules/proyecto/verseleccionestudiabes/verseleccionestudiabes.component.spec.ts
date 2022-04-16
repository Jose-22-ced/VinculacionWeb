import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerseleccionestudiabesComponent } from './verseleccionestudiabes.component';

describe('VerseleccionestudiabesComponent', () => {
  let component: VerseleccionestudiabesComponent;
  let fixture: ComponentFixture<VerseleccionestudiabesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VerseleccionestudiabesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VerseleccionestudiabesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

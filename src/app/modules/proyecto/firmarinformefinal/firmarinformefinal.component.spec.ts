import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FirmarinformefinalComponent } from './firmarinformefinal.component';

describe('FirmarinformefinalComponent', () => {
  let component: FirmarinformefinalComponent;
  let fixture: ComponentFixture<FirmarinformefinalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FirmarinformefinalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FirmarinformefinalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

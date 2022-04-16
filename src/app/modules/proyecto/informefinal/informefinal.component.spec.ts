import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InformefinalComponent } from './informefinal.component';

describe('InformefinalComponent', () => {
  let component: InformefinalComponent;
  let fixture: ComponentFixture<InformefinalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InformefinalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InformefinalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

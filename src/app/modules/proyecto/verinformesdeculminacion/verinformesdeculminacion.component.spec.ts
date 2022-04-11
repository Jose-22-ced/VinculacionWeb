import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerinformesdeculminacionComponent } from './verinformesdeculminacion.component';

describe('VerinformesdeculminacionComponent', () => {
  let component: VerinformesdeculminacionComponent;
  let fixture: ComponentFixture<VerinformesdeculminacionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VerinformesdeculminacionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VerinformesdeculminacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DescargardocumentoComponent } from './descargardocumento.component';

describe('DescargardocumentoComponent', () => {
  let component: DescargardocumentoComponent;
  let fixture: ComponentFixture<DescargardocumentoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DescargardocumentoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DescargardocumentoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

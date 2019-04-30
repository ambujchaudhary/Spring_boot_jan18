import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EquipmentsPreviewComponent } from './equipments-preview.component';

describe('EquipmentsPreviewComponent', () => {
  let component: EquipmentsPreviewComponent;
  let fixture: ComponentFixture<EquipmentsPreviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EquipmentsPreviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EquipmentsPreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

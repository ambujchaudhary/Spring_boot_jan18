import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AttachmentsPreviewComponent } from './attachments-preview.component';

describe('AttachmentsPreviewComponent', () => {
  let component: AttachmentsPreviewComponent;
  let fixture: ComponentFixture<AttachmentsPreviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AttachmentsPreviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AttachmentsPreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

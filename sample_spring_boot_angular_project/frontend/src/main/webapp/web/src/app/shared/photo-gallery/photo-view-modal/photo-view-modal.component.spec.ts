import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PhotoViewModalComponent } from './photo-view-modal.component';

describe('PhotoViewModalComponent', () => {
  let component: PhotoViewModalComponent;
  let fixture: ComponentFixture<PhotoViewModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PhotoViewModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PhotoViewModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

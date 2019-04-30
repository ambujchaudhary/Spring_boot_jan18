import { DebugElement } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { MaterialComponents } from '../../../utils/zu-material-components.module';
import { UploadedFile } from '../../user.model';

import { FileUploadComponent } from './file-upload.component';

describe('FileUploadComponent', () => {
  let component: FileUploadComponent;
  let fixture: ComponentFixture<FileUploadComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [MaterialComponents],
      declarations: [FileUploadComponent],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FileUploadComponent);
    component = fixture.componentInstance;

    component.data = new UploadedFile();
    component.index = 0;
    component.accepts = '';
    component.label = '+ add file';
    component.labelType = '';
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should able to change upload button type as "photo"', () => {
    let divDebugElement: DebugElement;

    component.labelType = 'photo';
    fixture.detectChanges();
    divDebugElement = fixture.debugElement.query(By.css('.photo-upload-label'));

    expect(divDebugElement).not.toBeNull();

    component.labelType = '';
    fixture.detectChanges();
    divDebugElement = fixture.debugElement.query(By.css('.photo-upload-label'));

    expect(divDebugElement).toBeNull();
  });

  it('should not assept accepts if accepts is not string', () => {
    const defaultAccepts = '';
    const testAccepts = '.jpg,.jpeg';

    let inputDebugElement: DebugElement;
    inputDebugElement = fixture.debugElement.query(By.css('input[type="file"]'));

    component.accepts = undefined;
    fixture.detectChanges();
    expect(inputDebugElement.attributes.accept).toEqual(defaultAccepts);

    component.accepts = null;
    fixture.detectChanges();
    expect(inputDebugElement.attributes.accept).toEqual(defaultAccepts);

    component.accepts = '';
    fixture.detectChanges();
    expect(inputDebugElement.attributes.accept).toEqual(defaultAccepts);

    component.accepts = '';
    fixture.detectChanges();
    expect(inputDebugElement.attributes.accept).toEqual('');

    component.accepts = testAccepts;
    fixture.detectChanges();
    expect(inputDebugElement.attributes.accept).toEqual(testAccepts);
  });

});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AutocompleteJobModalComponent } from './autocomplete-job-modal.component';

describe('AutocompleteJobModalComponent', () => {
  let component: AutocompleteJobModalComponent;
  let fixture: ComponentFixture<AutocompleteJobModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AutocompleteJobModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AutocompleteJobModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

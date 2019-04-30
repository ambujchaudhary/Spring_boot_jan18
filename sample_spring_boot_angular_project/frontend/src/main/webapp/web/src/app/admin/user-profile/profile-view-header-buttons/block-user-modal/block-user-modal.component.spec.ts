import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BlockUserModalComponent } from './block-user-modal.component';

describe('BlockUserModalComponent', () => {
  let component: BlockUserModalComponent;
  let fixture: ComponentFixture<BlockUserModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BlockUserModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BlockUserModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

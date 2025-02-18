import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { CreationFormComponent } from './creation-form.component';


describe('CreationFormComponent', () => {
  let component: CreationFormComponent;
  let fixture: ComponentFixture<CreationFormComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [CreationFormComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreationFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

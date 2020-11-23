import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ClubManagementFormComponent } from './club-management-form.component';


describe('ClubManagementFormComponent', () => {
  let component: ClubManagementFormComponent;
  let fixture: ComponentFixture<ClubManagementFormComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ClubManagementFormComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClubManagementFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { TeamTrainingFormComponent } from './team-training-form.component';


describe('TeamTrainingFormComponent', () => {
  let component: TeamTrainingFormComponent;
  let fixture: ComponentFixture<TeamTrainingFormComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [TeamTrainingFormComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TeamTrainingFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

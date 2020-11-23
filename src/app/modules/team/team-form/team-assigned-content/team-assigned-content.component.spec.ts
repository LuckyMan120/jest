import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { TeamAssignedContentComponent } from './team-assigned-content.component';


describe('TeamAssignedContentComponent', () => {
  let component: TeamAssignedContentComponent;
  let fixture: ComponentFixture<TeamAssignedContentComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [TeamAssignedContentComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TeamAssignedContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

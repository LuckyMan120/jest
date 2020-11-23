import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { MemberTeamMgmtFormComponent } from './member-team-mgmt-form.component';


describe('MemberTeamMgmtFormComponent', () => {
  let component: MemberTeamMgmtFormComponent;
  let fixture: ComponentFixture<MemberTeamMgmtFormComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [MemberTeamMgmtFormComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MemberTeamMgmtFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

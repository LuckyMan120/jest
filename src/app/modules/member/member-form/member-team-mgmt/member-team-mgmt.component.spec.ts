import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { MemberTeamMgmtComponent } from './member-team-mgmt.component';


describe('MemberTeamMgmtComponent', () => {
  let component: MemberTeamMgmtComponent;
  let fixture: ComponentFixture<MemberTeamMgmtComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [MemberTeamMgmtComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MemberTeamMgmtComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

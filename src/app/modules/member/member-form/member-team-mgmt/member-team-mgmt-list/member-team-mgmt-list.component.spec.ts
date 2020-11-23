import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { MemberTeamMgmtListComponent } from './member-team-mgmt-list.component';


describe('MemberTeamMgmtListComponent', () => {
  let component: MemberTeamMgmtListComponent;
  let fixture: ComponentFixture<MemberTeamMgmtListComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [MemberTeamMgmtListComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MemberTeamMgmtListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

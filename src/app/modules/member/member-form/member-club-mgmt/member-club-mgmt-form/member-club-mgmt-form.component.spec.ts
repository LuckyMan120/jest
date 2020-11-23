import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { MemberClubMgmtFormComponent } from './member-club-mgmt-form.component';


describe('MemberClubMgmtFormComponent', () => {
  let component: MemberClubMgmtFormComponent;
  let fixture: ComponentFixture<MemberClubMgmtFormComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [MemberClubMgmtFormComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MemberClubMgmtFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

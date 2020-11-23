import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { MemberClubMgmtComponent } from './member-club-mgmt.component';


describe('MemberClubMgmtComponent', () => {
  let component: MemberClubMgmtComponent;
  let fixture: ComponentFixture<MemberClubMgmtComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [MemberClubMgmtComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MemberClubMgmtComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

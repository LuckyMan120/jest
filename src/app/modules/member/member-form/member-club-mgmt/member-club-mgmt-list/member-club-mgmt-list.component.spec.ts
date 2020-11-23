import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { MemberClubMgmtListComponent } from './member-club-mgmt-list.component';


describe('MemberClubMgmtListComponent', () => {
  let component: MemberClubMgmtListComponent;
  let fixture: ComponentFixture<MemberClubMgmtListComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [MemberClubMgmtListComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MemberClubMgmtListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

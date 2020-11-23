import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ClubManagementListComponent } from './club-management-list.component';


describe('ClubManagementListComponent', () => {
  let component: ClubManagementListComponent;
  let fixture: ComponentFixture<ClubManagementListComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ClubManagementListComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClubManagementListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

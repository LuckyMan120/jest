import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ClubPositionTableComponent } from './club-position-table.component';


describe('ClubPositionTableComponent', () => {
  let component: ClubPositionTableComponent;
  let fixture: ComponentFixture<ClubPositionTableComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ClubPositionTableComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClubPositionTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

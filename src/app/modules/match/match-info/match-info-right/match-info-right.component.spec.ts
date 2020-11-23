import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { MatchInfoRightComponent } from './match-info-right.component';


describe('MatchInfoRightComponent', () => {
  let component: MatchInfoRightComponent;
  let fixture: ComponentFixture<MatchInfoRightComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [MatchInfoRightComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MatchInfoRightComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

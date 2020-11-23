import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { SponsorItemComponent } from './sponsor-item.component';


describe('SponsorItemComponent', () => {
  let component: SponsorItemComponent;
  let fixture: ComponentFixture<SponsorItemComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [SponsorItemComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SponsorItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

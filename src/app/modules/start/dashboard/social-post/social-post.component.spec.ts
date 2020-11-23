import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { SocialPostComponent } from './social-post.component';


describe('SocialPostComponent', () => {
  let component: SocialPostComponent;
  let fixture: ComponentFixture<SocialPostComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [SocialPostComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SocialPostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

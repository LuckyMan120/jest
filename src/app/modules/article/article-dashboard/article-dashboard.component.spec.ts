import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ArticleDashboardComponent } from './article-dashboard.component';


describe('ArticleDashboardComponent', () => {
  let component: ArticleDashboardComponent;
  let fixture: ComponentFixture<ArticleDashboardComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ArticleDashboardComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ArticleDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

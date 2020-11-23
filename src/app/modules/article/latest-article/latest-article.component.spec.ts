import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { LatestArticleComponent } from './latest-article.component';


describe('LatestArticleComponent', () => {
  let component: LatestArticleComponent;
  let fixture: ComponentFixture<LatestArticleComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [LatestArticleComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LatestArticleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

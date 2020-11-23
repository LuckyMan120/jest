import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { Category } from '../_interfaces/category.interface';
import { FirestoreService } from './../../../shared/services/firestore.service';
import { CategoryService } from './../category.service';

@Component({
  selector: 'app-category-detail',
  templateUrl: './category-detail.component.html',
  styleUrls: ['./category-detail.component.scss']
})
export class CategoryDetailComponent implements OnInit {

  category$!: Observable<Category | undefined>;

  constructor(
    private route: ActivatedRoute,
    private categoryService: CategoryService,
    private firestoreService: FirestoreService
  ) { }

  ngOnInit() {
    this.category$ = this.route.params.pipe(
      switchMap(params => this.categoryService.get(params.categoryId))
    );
  }

  deleteCategory(item: Category) {
    this.firestoreService.removeItem('categories', item, '/categories/list');
  }

}

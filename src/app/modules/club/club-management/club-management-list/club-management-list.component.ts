import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { FirestoreService } from '../../../../shared/services/firestore.service';
import { Category } from '../../../category/_interfaces/category.interface';
import { ClubManagement } from '../../_interfaces/club-management.interface';
import { CategoryService } from './../../../category/category.service';

@Component({
  selector: 'app-club-management-list',
  templateUrl: './club-management-list.component.html',
  styleUrls: ['./club-management-list.component.scss']
})
export class ClubManagementListComponent implements OnInit {

  categories$!: Observable<Category[]>;
  positions$!: Observable<ClubManagement[]>;

  step = 0;

  constructor(
    private firestoreService: FirestoreService,
    private categoryService: CategoryService
  ) {
  }

  ngOnInit() {
    this.categories$ = this.categoryService.getCategoryListByParentCategoryTitle('Vereinsführung');
    this.positions$ = this.firestoreService.col$<ClubManagement>('club-management');
  }

  setStep(index: number) {
    this.step = index;
  }

}

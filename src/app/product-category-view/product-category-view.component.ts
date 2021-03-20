import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../services/auth/auth.service';

@Component({
  selector: 'app-product-category-view',
  templateUrl: './product-category-view.component.html',
  styleUrls: ['./product-category-view.component.css']
})
export class ProductCategoryViewComponent implements OnInit {

  categoryId: String = '';
  productList = [];
  categoryName: String = '';
  constructor(
    private authService: AuthService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.categoryId = this.activatedRoute.snapshot.paramMap.get('id');
    let obj = {
      skip: 0,
      limit: 20,
      categoryId: this.categoryId
    }
    if (this.categoryId) {
      this.authService.getOneCategory(this.categoryId).subscribe((res: any) => {
        this.categoryName = res.data.categoryName;
      });
      this.authService.getProductsByCategory(obj).subscribe((res: any) => {
        if (res.code === 200) {
          this.productList = res.data;
        }
      });
    } else {
      this.router.navigate(['']);
    }
  }

}

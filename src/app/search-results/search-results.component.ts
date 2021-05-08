import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../services/auth/auth.service';

@Component({
  selector: 'app-search-results',
  templateUrl: './search-results.component.html',
  styleUrls: ['./search-results.component.css']
})
export class SearchResultsComponent implements OnInit {

  term: string;
  searchResults: any = [];
  constructor(
    private authService: AuthService,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.term = this.route.snapshot.url[1].path;
    this.getSearchResults();
  }

  getSearchResults() {
    if (this.term === '') {
      this.searchResults = [];
    }
    this.authService.searchProduct(this.term).subscribe(resp => {
      this.searchResults = resp['data'];
    });
  }

}

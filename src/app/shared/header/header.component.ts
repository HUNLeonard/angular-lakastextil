// src/app/components/header/header.component.ts
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  searchText: string = '';
  showAccountMenu: boolean = false;
  isLoggedIn: boolean = false;
  private _showCartMenu: boolean = false;

  constructor(
    private router: Router,
    private authService: AuthService,
    private route: ActivatedRoute
  ) {
    this.authService.isLoggedIn().subscribe(isLoggedIn => {
      this.isLoggedIn = isLoggedIn;
    });
  }

  get showCartMenu(): boolean {
    return this.router.url !== '/cart' && this._showCartMenu;
  }

  set showCartMenu(value: boolean) {
    this._showCartMenu = value;
  }

  searchProducts() {
    this.router.navigate(['/products'], { queryParams: { search: this.searchText } });
  }

  logOut(event: Event) {
    event.preventDefault();
    this.authService.signOut()
      .then(() => {
        this.router.navigate(['/']);
      })
      .catch(error => console.error(error));
  }
}
import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { LandingComponent } from './landing/landing.component';
import { MovieDetailComponent } from './movie-details/movie-detail.component';
import { LoginComponent } from './auth/login/login.component';
import { WishlistComponent } from './pages/wishlist.component'; // ✅ import the new component

export const routes: Routes = [
  { path: '', component: LandingComponent },
  { path: 'movie/:id', component: MovieDetailComponent },
  { path: 'home', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'wishlist', component: WishlistComponent }, // ✅ new route
];

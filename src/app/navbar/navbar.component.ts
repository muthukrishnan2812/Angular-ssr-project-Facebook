import { NgOptimizedImage } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterModule,NgOptimizedImage],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent {
  searchInput:string='';
  isActive: boolean = false;

  onInputChange(value: string) {
    this.searchInput = value.trim();
  }
  toggleActive() {
    this.isActive = !this.isActive;
  }
}

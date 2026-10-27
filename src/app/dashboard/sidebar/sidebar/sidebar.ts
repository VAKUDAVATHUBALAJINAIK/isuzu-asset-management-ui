
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule
  ],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.scss'
})
export class Sidebar {

  // Asset submenu open / close
  isAssetMenuOpen = false;
  debugAssetEntry(): void {

  console.log('Asset Entry clicked');

}

  toggleAssetMenu(): void {
    this.isAssetMenuOpen = !this.isAssetMenuOpen;
  }

}


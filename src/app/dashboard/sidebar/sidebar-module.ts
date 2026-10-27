import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Sidebar } from './sidebar/sidebar';

@NgModule({
  imports: [
    CommonModule,
    Sidebar
  ],
  exports: [
    Sidebar
  ]
})
export class SidebarModule {}
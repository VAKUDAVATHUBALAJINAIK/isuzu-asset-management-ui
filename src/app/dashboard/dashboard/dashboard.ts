import { Component } from '@angular/core';

import { Sidebar } from '../sidebar/sidebar/sidebar';
import { Header } from '../header/header';
import { SummaryCards } from './summary-cards/summary-cards';
import { QuickActions } from '../quick-actions/quick-actions';
import { Charts } from '../charts/charts';
import { RecentAssets } from '../recent-assets/recent-assets';


@Component({
  selector: 'app-dashboard',
  standalone: true,

  imports: [
    Sidebar,
    Header,
    SummaryCards,
    QuickActions,
    Charts,
    RecentAssets
  ],

  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss'
})
export class Dashboard {

}
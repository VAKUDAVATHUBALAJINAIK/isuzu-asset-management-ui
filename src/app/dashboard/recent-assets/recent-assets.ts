import { Component } from '@angular/core';

interface RecentAsset {
  assetCode: string;
  assetName: string;
  category: string;
  employee: string;
  location: string;
  status: string;
  statusClass: string;
  icon: string;
  lastUpdated: string;
}

@Component({
  selector: 'app-recent-assets',
  standalone: true,
  imports: [],
  templateUrl: './recent-assets.html',
  styleUrl: './recent-assets.scss'
})
export class RecentAssets {

  recentAssets: RecentAsset[] = [

    {
      assetCode: 'AST-1001',
      assetName: 'Dell Latitude 5520',
      category: 'Laptop',
      employee: 'Ravi Kumar',
      location: 'Chennai',
      status: 'Assigned',
      statusClass: 'assigned',
      icon: '💻',
      lastUpdated: 'Today, 10:25 AM'
    },

    {
      assetCode: 'AST-1002',
      assetName: 'HP ProDesk 400',
      category: 'Desktop',
      employee: 'Suresh Kumar',
      location: 'Bangalore',
      status: 'Available',
      statusClass: 'available',
      icon: '🖥️',
      lastUpdated: 'Today, 09:45 AM'
    },

    {
      assetCode: 'AST-1003',
      assetName: 'Samsung Monitor',
      category: 'Monitor',
      employee: 'Priya Sharma',
      location: 'Chennai',
      status: 'Assigned',
      statusClass: 'assigned',
      icon: '🖥️',
      lastUpdated: 'Today, 09:20 AM'
    },

    {
      assetCode: 'AST-1004',
      assetName: 'Canon Printer',
      category: 'Printer',
      employee: 'Admin Team',
      location: 'Hyderabad',
      status: 'Maintenance',
      statusClass: 'maintenance',
      icon: '🖨️',
      lastUpdated: 'Yesterday, 04:20 PM'
    },

    {
      assetCode: 'AST-1005',
      assetName: 'Lenovo ThinkPad',
      category: 'Laptop',
      employee: 'Arun Kumar',
      location: 'Chennai',
      status: 'Available',
      statusClass: 'available',
      icon: '💻',
      lastUpdated: 'Yesterday, 02:15 PM'
    }

  ];


  viewAllAssets(): void {

    console.log('View all assets');

  }


  viewAsset(asset: RecentAsset): void {

    console.log('Selected asset:', asset);

  }

}
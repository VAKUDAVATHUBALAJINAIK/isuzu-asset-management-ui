import { Component } from '@angular/core';

interface AssetStatus {
  label: string;
  value: number;
  percentage: number;
  icon: string;
  color: string;
}

interface MonthlyAsset {
  month: string;
  value: number;
  change: number;
}

@Component({
  selector: 'app-charts',
  standalone: true,
  imports: [],
  templateUrl: './charts.html',
  styleUrl: './charts.scss'
})
export class Charts {

  // =====================================================
  // ASSET STATUS
  // Static UI data for now
  // Later: API response
  // =====================================================

  assetStatus: AssetStatus[] = [

    {
      label: 'Assigned',
      value: 8,
      percentage: 40,
      icon: '👤',
      color: '#6c8cff'
    },

    {
      label: 'Available',
      value: 9,
      percentage: 45,
      icon: '✔',
      color: '#58c7b0'
    },

    {
      label: 'Maintenance',
      value: 3,
      percentage: 15,
      icon: '🔧',
      color: '#f2b84b'
    },

    {
      label: 'Disposed',
      value: 0,
      percentage: 0,
      icon: '♻️',
      color: '#ef8f8f'
    }

  ];


  // =====================================================
  // MONTHLY ASSET DATA
  // =====================================================

  monthlyAssets: MonthlyAsset[] = [

    {
      month: 'Mar',
      value: 12,
      change: 4
    },

    {
      month: 'Apr',
      value: 15,
      change: 3
    },

    {
      month: 'May',
      value: 14,
      change: -1
    },

    {
      month: 'Jun',
      value: 18,
      change: 4
    },

    {
      month: 'Jul',
      value: 19,
      change: 1
    },

    {
      month: 'Aug',
      value: 20,
      change: 1
    }

  ];


  // =====================================================
  // TOTAL ASSETS
  // =====================================================

  totalAssets = 20;


  // =====================================================
  // CURRENT MONTH
  // =====================================================

  get currentMonthAssets(): number {

    if (!this.monthlyAssets.length) {
      return 0;
    }

    return this.monthlyAssets[
      this.monthlyAssets.length - 1
    ].value;
  }


  // =====================================================
  // PREVIOUS MONTH
  // =====================================================

  get previousMonthAssets(): number {

    if (this.monthlyAssets.length < 2) {
      return 0;
    }

    return this.monthlyAssets[
      this.monthlyAssets.length - 2
    ].value;
  }


  // =====================================================
  // MONTHLY GROWTH
  // =====================================================

  get monthlyGrowth(): number {

    const current =
      this.currentMonthAssets;

    const previous =
      this.previousMonthAssets;

    if (previous === 0) {
      return 0;
    }

    return Number(
      (
        ((current - previous) / previous) * 100
      ).toFixed(1)
    );
  }


  // =====================================================
  // MAXIMUM VALUE FOR GRAPH
  // =====================================================

  get maxMonthlyValue(): number {

    if (!this.monthlyAssets.length) {
      return 1;
    }

    return Math.max(
      ...this.monthlyAssets.map(
        item => item.value
      )
    );
  }


  // =====================================================
  // GRAPH BAR HEIGHT
  // =====================================================

  getBarHeight(value: number): number {

    if (this.maxMonthlyValue === 0) {
      return 0;
    }

    return (
      value / this.maxMonthlyValue
    ) * 100;
  }


  // =====================================================
  // STATUS TOTAL
  // =====================================================

  get statusTotal(): number {

    return this.assetStatus.reduce(
      (total, item) =>
        total + item.value,
      0
    );
  }


  // =====================================================
  // VIEW CHART DETAILS
  // UI ONLY FOR NOW
  // =====================================================

  viewChart(chart: string): void {

    console.log(
      'Chart selected:',
      chart
    );

  }

}
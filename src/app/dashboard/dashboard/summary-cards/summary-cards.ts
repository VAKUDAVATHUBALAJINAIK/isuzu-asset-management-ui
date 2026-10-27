import { Component } from '@angular/core';

interface SummaryCard {
  icon: string;
  value: string;
  title: string;
  description: string;
}

@Component({
  selector: 'app-summary-cards',
  standalone: true,
  imports: [],
  templateUrl: './summary-cards.html',
  styleUrl: './summary-cards.scss'
})
export class SummaryCards {

  summaryCards: SummaryCard[] = [

    {
      icon: '📦',
      value: '20',
      title: 'TOTAL ASSETS',
      description: 'All Registered Assets'
    },

    {
      icon: '👤',
      value: '8',
      title: 'ASSIGNED ASSETS',
      description: '40% active assets'
    },

    {
      icon: '✔',
      value: '9',
      title: 'AVAILABLE ASSETS',
      description: '45% active assets'
    },

    {
      icon: '🔧',
      value: '3',
      title: 'UNDER MAINTENANCE',
      description: '15% of total assets'
    },

    {
      icon: '♻️',
      value: '0',
      title: 'DISPOSED ASSETS',
      description: '0% of total assets'
    },

    {
      icon: '💰',
      value: '₹21,78,765',
      title: 'CURRENT BOOK VALUE',
      description: 'Depreciated Value'
    },

    {
      icon: '⚠️',
      value: '0',
      title: 'WARRANTY EXPIRING SOON',
      description: 'Within 10 Days'
    },

    {
      icon: '💰',
      value: '₹37,46,768',
      title: 'TOTAL PURCHASE VALUE',
      description: 'Acquisition Cost'
    }

  ];

}
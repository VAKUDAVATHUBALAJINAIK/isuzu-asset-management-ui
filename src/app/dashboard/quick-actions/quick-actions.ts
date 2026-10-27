import { Component } from '@angular/core';

interface QuickAction {
  icon: string;
  title: string;
}

@Component({
  selector: 'app-quick-actions',
  standalone: true,
  imports: [],
  templateUrl: './quick-actions.html',
  styleUrl: './quick-actions.scss'
})
export class QuickActions {

  quickActions: QuickAction[] = [

    {
      icon: '👤',
      title: 'Assign Asset'
    },

    {
      icon: '↩️',
      title: 'Return Asset'
    },

    {
      icon: '🔄',
      title: 'Transfer Asset'
    },

    {
      icon: '🔧',
      title: 'Maintenance'
    },

    {
      icon: '♻️',
      title: 'Disposal'
    },

    {
      icon: '👥',
      title: 'Employee'
    },

    {
      icon: '🏢',
      title: 'Vendor'
    },

    {
      icon: '＋',
      title: 'Add Asset'
    }

  ];


  onActionClick(action: QuickAction): void {

    console.log(
      'Quick Action clicked:',
      action.title
    );

  }

}
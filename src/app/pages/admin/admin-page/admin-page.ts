import { Component, inject, signal } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AllCommunityModule, ModuleRegistry, ColDef } from 'ag-grid-community';
import { AgGridAngular } from 'ag-grid-angular';
import prods from '../prod.json';
import { StatusBar } from '../../../core/layout/status-bar/status-bar';
import { AuthService } from '../../../core/auth/auth.service';

ModuleRegistry.registerModules([AllCommunityModule]);

interface ActivityRow {
  type: string;
  label: string;
  time: string;
}

@Component({
  selector: 'app-admin-page',
  imports: [AgGridAngular, StatusBar, RouterLink, CurrencyPipe],
  templateUrl: './admin-page.html',
  styleUrl: './admin-page.scss',
})
export class AdminPage {
  private readonly auth = inject(AuthService);

  protected readonly tab = signal<'stats' | 'log' | 'products'>('stats');

  // --- summary stats (derived from the static prod.json) ---
  protected readonly totalProducts = prods.length;
  protected readonly outOfStock = prods.filter((p) => p.quantity === 0).length;
  protected readonly inStockUnits = prods.reduce((s, p) => s + p.quantity, 0);
  protected readonly inventoryValue = prods.reduce(
    (s, p) => s + p.price * p.quantity,
    0
  );

  // --- recent activity (static / visual only) ---
  protected readonly activity: ActivityRow[] = [
    { type: 'login', label: 'admin@sukuna.店', time: '2m ago' },
    { type: 'cart', label: 'Naga Dragon Bracelet', time: '6m ago' },
    { type: 'signup', label: 'jane@doe.com', time: '22m ago' },
    { type: 'checkout', label: '$1,556.94', time: '1h ago' },
    { type: 'login', label: 'hadi@sukuna.店', time: '3h ago' },
    { type: 'cart', label: 'WD 2TB Elements Drive', time: '5h ago' },
  ];

  // --- product grid ---
  rowData = prods.map((p) => ({
    ID: p.id,
    Name: p.title,
    Description: p.description,
    Price: p.price,
    Status: p.quantity,
  }));

  colDefs: ColDef[] = [
    { field: 'ID', maxWidth: 90 },
    { field: 'Name', flex: 2 },
    { field: 'Description', flex: 3, cellEditor: 'agTextCellEditor' },
    { field: 'Price', maxWidth: 120 },
    {
      headerName: 'Status',
      field: 'Status',
      maxWidth: 120,
      cellRenderer: (params: { value: number }) =>
        params.value > 0 ? 'still' : 'out',
    },
  ];

  protected logout(): void {
    this.auth.logout();
  }
}

import { Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DropStatus, DropStatusType } from '../../../shared/services/drop-status';
import {
  AllCommunityModule,
  ModuleRegistry,
  ColDef,
  themeQuartz,
} from 'ag-grid-community';
import { AgGridAngular } from 'ag-grid-angular';
import prods from '../prod.json';
import { AuthService } from '../../../core/auth/auth.service';

ModuleRegistry.registerModules([AllCommunityModule]);

// description edits persist to localStorage (the browser can't write prod.json)
const DESC_KEY = 'sukuna-product-desc';
function loadDescOverrides(): Record<number, string> {
  try {
    return JSON.parse(localStorage.getItem(DESC_KEY) ?? '{}');
  } catch {
    return {};
  }
}
const descOverrides = loadDescOverrides();

@Component({
  selector: 'app-admin-page',
  imports: [AgGridAngular, RouterLink],
  templateUrl: './admin-page.html',
  styleUrl: './admin-page.scss',
})
export class AdminPage {
  private readonly auth = inject(AuthService);

  protected readonly tab = signal<'dashboard' | 'products' | 'users'>('dashboard');

  protected readonly dropStatus = inject(DropStatus);
  protected readonly dropStatuses: DropStatusType[] = [
    'Teaser',
    'Upcoming',
    'Live',
    'Ended',
  ];

  protected readonly dropDateInput = computed(() => {
    const d = this.dropStatus.dropDate();
    const pad = (n: number) => String(n).padStart(2, '0');
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
  });

  protected onDropDateChange(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    if (value) this.dropStatus.dropDate.set(new Date(value));
  }

  // --- stat cards (static / visual) ---
  protected readonly stats = [
    { label: 'REVENUE', value: '$48.2k', sub: '+12% vs last week' },
    { label: 'ORDERS', value: '1,284', sub: '+8% vs last week' },
    { label: 'PRODUCTS', value: String(prods.length), sub: '+2 new' },
    { label: 'CUSTOMERS', value: '3,940', sub: '+5% vs last week' },
  ];

  // --- sales chart (static bar heights, %) ---
  protected readonly salesBars = [
    { day: 'Mon', pct: 38 },
    { day: 'Tue', pct: 55 },
    { day: 'Wed', pct: 45 },
    { day: 'Thu', pct: 64 },
    { day: 'Fri', pct: 58 },
    { day: 'Sat', pct: 90 },
    { day: 'Sun', pct: 72 },
  ];

  // --- recent activity (static / visual) ---
  protected readonly activity = [
    { tone: 'red', text: 'New order #4821 · Aurora Wireless Headphones', time: '2m ago' },
    { tone: 'gold', text: 'Blossom Wrap Dress restocked (+40)', time: '26m ago' },
    { tone: 'red', text: 'New customer signup · kenji@mail.jp', time: '1h ago' },
    { tone: 'gold', text: 'Order #4818 shipped to Osaka', time: '3h ago' },
    { tone: 'red', text: 'Refund processed · Order #4790', time: '5h ago' },
  ];

  // --- pending applications (static / visual) ---
  protected readonly pendingUsers = signal([
    { id: 1, name: 'Kenji Tanaka', email: 'kenji@mail.jp', registered: '2026-07-28' },
    { id: 2, name: 'Aoi Yamamoto', email: 'aoi.y@domain.com', registered: '2026-07-28' },
    { id: 3, name: 'Marcus Chen', email: 'mchen@example.com', registered: '2026-07-27' },
    { id: 4, name: 'Yuki Sato', email: 'yuki@sukuna.jp', registered: '2026-07-27' },
    { id: 5, name: 'Blossom Ito', email: 'blossom@mail.jp', registered: '2026-07-26' },
    { id: 6, name: 'David Park', email: 'dpark@domain.com', registered: '2026-07-26' },
  ]);

  protected accept(id: number): void {
    this.pendingUsers.update((list) => list.filter((u) => u.id !== id));
  }
  protected reject(id: number): void {
    this.pendingUsers.update((list) => list.filter((u) => u.id !== id));
  }

  // --- product grid, dark-themed to match the site ---
  protected readonly gridTheme = themeQuartz.withParams({
    backgroundColor: '#0b0a0b',
    foregroundColor: '#ECE8E1',
    headerBackgroundColor: '#161616',
    headerTextColor: '#C29C25',
    borderColor: '#2a2a2a',
    rowHoverColor: '#161616',
    oddRowBackgroundColor: '#100f10',
    accentColor: '#C8362A',
    fontFamily: 'var(--font-terminal)',
    headerFontFamily: 'var(--font-terminal)',
    fontSize: 13,
    browserColorScheme: 'dark',
    wrapperBorderRadius: 0,
    borderRadius: 0,
  });

  rowData = prods.map((p) => ({
    ID: p.id,
    Image: p.image,
    Name: p.title,
    Category: p.category,
    Description: descOverrides[p.id] ?? p.description,
    Price: p.price,
    Status: p.quantity,
  }));

  // center every cell's content, both axes
  protected readonly defaultColDef: ColDef = {
    cellStyle: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
  };

  colDefs: ColDef[] = [
    { field: 'ID', maxWidth: 80 },
    {
      headerName: 'Image',
      field: 'Image',
      maxWidth: 100,
      sortable: false,
      autoHeight: true,
      // red backdrop + multiply blend, same look as the shop product cards
      cellRenderer: (p: { value: string }) =>
        `<div style="width:90px;height:90px;display:inline-flex;align-items:center;justify-content:center;background:url('/prod_card_back.png') center/cover no-repeat;">` +
        `<img src="${p.value}" alt="" style="width:100%;height:100%;object-fit:contain;" />` +
        `</div>`,
    },
    { field: 'Name', flex: 2 },
    {
      field: 'Category',
      flex: 1,
      valueFormatter: (p: { value: string }) => (p.value ?? '').toUpperCase(),
    },
    {
      field: 'Description',
      flex: 3,
      editable: true, // double-click to edit
      wrapText: true,
      autoHeight: true,
      // full description, wrapped + vertically centered
      cellStyle: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-start',
        whiteSpace: 'normal',
        lineHeight: '1.6',
        padding: '12px 14px',
      },
      cellEditor: 'agLargeTextCellEditor',
      cellEditorPopup: true,
      cellEditorParams: { maxLength: 2000, rows: 8, cols: 60 },
    },
    {
      field: 'Price',
      maxWidth: 110,
      valueFormatter: (p: { value: number }) => '$' + p.value.toFixed(2),
    },
    {
      headerName: 'Status',
      field: 'Status',
      maxWidth: 150,
      // html pill: gold = in stock, red = out of stock
      cellRenderer: (p: { value: number }) => {
        const inStock = p.value > 0;
        const bg = inStock ? '#C29C25' : '#C8362A';
        const label = inStock ? 'in stock' : 'out of stock';
        return `<span style="display:inline-block;box-sizing:border-box;min-width:92px;text-align:center;padding:3px 8px;background:${bg};color:#000;font-family:var(--font-terminal);font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:0.05em;">${label}</span>`;
      },
    },
  ];

  // save an edited description to localStorage
  protected onCellEdit(event: {
    colDef: { field?: string };
    data: Record<string, unknown>;
  }): void {
    if (event.colDef.field === 'Description') {
      descOverrides[event.data['ID'] as number] = event.data[
        'Description'
      ] as string;
      localStorage.setItem(DESC_KEY, JSON.stringify(descOverrides));
    }
  }

  protected logout(): void {
    this.auth.logout();
  }
}

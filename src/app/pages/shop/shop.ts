import { Component } from '@angular/core';
import { Header } from '../../core/layout/header/header';
import { StatusBar } from '../../core/layout/status-bar/status-bar';

@Component({
  selector: 'app-shop',
  imports: [Header, StatusBar],
  templateUrl: './shop.html',
  styleUrl: './shop.scss',
})
export class Shop {}

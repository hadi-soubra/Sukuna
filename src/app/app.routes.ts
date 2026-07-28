import { Routes } from '@angular/router';
import {Login} from './pages/login/login';
import {Shop} from './pages/shop/shop';
import { Product } from './pages/product/product';
import { Listing } from './pages/listing/listing';
import { AdminLogin } from './pages/admin/admin-login/admin-login';
import { AdminPage } from './pages/admin/admin-page/admin-page';



export const routes: Routes = [
    {
        path: '',
        component: Login
    },
    {
        path: 'shop',
        component: Shop
    },
    {
        path: 'product/:id',
        component: Product
    },
    {
        path: 'shop/:category',
        component: Listing
    },
    {
        path: 'admin-login',
        component: AdminLogin
    },

    {
        path: 'admin',
        component: AdminPage
    },
];

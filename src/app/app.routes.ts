import { Routes } from '@angular/router';
import {Login} from './pages/login/login';
import {Home} from './pages/home/home';
import { AdminLogin } from './pages/admin/admin-login/admin-login';
import { AdminPage } from './pages/admin/admin-page/admin-page';



export const routes: Routes = [
    {
        path: '',
        component: Login
    },
    {
        path: 'home',
        component: Home
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

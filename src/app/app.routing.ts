import { ModuleWithProviders } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LoginComponent } from './components/login/login.component';
import { ErrorComponent } from './components/error/error.component';
import { ProductosComponent } from './components/productos/productos.component';
import { HomeComponent } from './components/home/home.component';
import { MarcasProductoComponent } from './components/marcas-producto/marcas-producto.component';
import { CreateProductoComponent } from './components/productos/create-producto/create-producto.component';
import { CreateMarcaComponent } from './components/marcas-producto/create-marca/create-marca.component';
import { TiposProductoComponent } from './components/tipos-producto/tipos-producto.component';
import { CreateTipoComponent } from './components/tipos-producto/create-producto/create-tipo.component';
import { FacturasComponent } from './components/facturas/facturas.component';
import { CreateFacturaComponent } from './components/facturas/create-factura/create-factura.component';
import { CorrelativosComponent } from './components/correlativos/correlativos.component';
import { CreateCorrelativoComponent } from './components/correlativos/create-correlativo/create-correlativo.component';

const appRoutes: Routes = [
    {path: '', component: LoginComponent},
    {path: 'login', component: LoginComponent},
    {path: 'home', component: HomeComponent},

    /****** MENUS DE PRODUCTOS ******/
    {path: 'productos/index', component: ProductosComponent},
    {path: 'productos/create', component: CreateProductoComponent},
    {path: 'productos/create/:id', component: CreateProductoComponent},
    {path: 'productos/marcas/index', component: MarcasProductoComponent},
    {path: 'productos/marcas/create', component: CreateMarcaComponent},
    {path: 'productos/marcas/create/:id', component: CreateMarcaComponent},
    {path: 'productos/categorias/index', component: TiposProductoComponent},
    {path: 'productos/categorias/create', component: CreateTipoComponent},
    {path: 'productos/categorias/create/:id', component: CreateTipoComponent},

    /****** MENUS DE FACTURAS ******/
    {path: 'facturas/index', component: FacturasComponent},
    {path: 'facturas/create', component: CreateFacturaComponent},
    {path: 'facturas/correlativos/index', component: CorrelativosComponent},
    {path: 'facturas/correlativos/create', component: CreateCorrelativoComponent},

    {path: '**', component: ErrorComponent}
];

export const appRoutingProviders: any[] = [];
export const routing: ModuleWithProviders<any> = RouterModule.forRoot(appRoutes);

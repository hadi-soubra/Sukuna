import { Component } from '@angular/core';
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community';
import { AgGridAngular } from 'ag-grid-angular'; 
import { ColDef } from 'ag-grid-community'; 
import prods from '../prod.json';

ModuleRegistry.registerModules([AllCommunityModule]);

@Component({
  selector: 'app-admin-page',
  imports: [AgGridAngular],
  templateUrl: './admin-page.html',
  styleUrl: './admin-page.scss',
})
export class AdminPage {
      rowData = prods.map(p => ({
    ID: p.id,
    Name: p.title,
    Description: p.description,
    Price: p.price,
    Status: p.quantity,
    }));

    colDefs: ColDef[] = [
        { field: "ID" },

        { field: "Name" },

        { 
            field: "Description" ,
            cellEditor: "agTextCellEditor",
        },

        { field: "Price" },        
        
        {
            headerName: "Stause",
            field: "Status",
            cellRenderer: (params: any) => params.value > 0 ? "still" : "out"
        }
    ];
}


declare const $;

// tslint:disable-next-line: no-string-literal
window['$'] = window['jQuery'] = $;

export class JqueryConfigs {
    constructor() { }

    // MÉTODO DE INICIALIZACIÓN DE DATATABLE ADMILTE
    configDataTable(nombreTabla: string): void {
        $(() => {
            $(`#${nombreTabla}`).DataTable({
                responsive: true, lengthChange: true, autoWidth: false,
                buttons: ['csv', 'excel']
            }).buttons().container().appendTo('#' + nombreTabla + '_wrapper .col-md-6:eq(0)');
        });
    }

    // MÉTODO DE INICIALIZACION DE TOOLTIPS
    configToolTip(): void {
        $(() => {
            $('[data-toggle="tooltip"]').tooltip({
                trigger: 'hover'
            });

            $.widget.bridge('uibutton', $.ui.button)
        });
    }
}

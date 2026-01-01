import * as XLSX from 'xlsx';

export function usePeriodExport() {
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'N/A';
    return date.toLocaleString('es-CO', { 
      year: 'numeric', 
      month: '2-digit', 
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const downloadExcel = (period, summary, people, expenses, otherIncomes, totals, paidCount) => {
    // Crear hoja de resumen
    const resumenData = [
      ['RESUMEN DEL PERIODO', period],
      [],
      ['Cuota Mensual Global', summary.feeAmount || 'No definida'],
      ['Cuotas Pagadas', totals.monthIn || 0],
      ['Otros Ingresos', totals.otherIncome || 0],
      ['Total Egresos', totals.monthOut || 0],
      ['Balance del Mes', totals.monthNet || 0],
      ['Personas que Pagaron', `${paidCount} / ${people.length}`],
      [],
      [],
      ['DETALLE DE PAGOS'],
      ['Nombre', 'Cuota Asignada', 'Monto Pagado', 'Estado']
    ];

    people.forEach(person => {
      const cuotaAsignada = person.monthlyFee || summary.feeAmount || 0;
      resumenData.push([
        person.name,
        cuotaAsignada,
        person.paid ? cuotaAsignada : 0,
        person.paid ? 'Pagó' : 'No pagó'
      ]);
    });

    resumenData.push([]);
    resumenData.push([]);
    resumenData.push(['DETALLE DE GASTOS']);
    resumenData.push(['Descripción', 'Monto', 'Fecha']);

    expenses.forEach(expense => {
      resumenData.push([
        expense.description,
        expense.amount,
        formatDate(expense.spentAt)
      ]);
    });

    resumenData.push([]);
    resumenData.push([]);
    resumenData.push(['OTROS INGRESOS']);
    resumenData.push(['Descripción', 'Monto', 'Fecha']);

    otherIncomes.forEach(income => {
      resumenData.push([
        income.description,
        income.amount,
        formatDate(income.receivedAt)
      ]);
    });

    // Crear hoja de pagos
    const pagosData = [
      ['PAGOS DEL PERIODO'],
      ['Nombre', 'Cuota Asignada', 'Estado', 'Monto Pagado', 'Fecha de Pago']
    ];
    
    people.forEach(person => {
      const cuotaAsignada = person.monthlyFee || summary.feeAmount || 0;
      pagosData.push([
        person.name,
        cuotaAsignada,
        person.paid ? 'Pagó' : 'No pagó',
        person.paid ? cuotaAsignada : 0,
        person.payment ? formatDate(person.payment.paidAt) : 'N/A'
      ]);
    });

    // Crear hoja de gastos
    const gastosData = [
      ['GASTOS DEL PERIODO'],
      ['Descripción', 'Monto', 'Fecha']
    ];

    expenses.forEach(expense => {
      gastosData.push([
        expense.description,
        expense.amount,
        formatDate(expense.spentAt)
      ]);
    });

    // Crear hoja de otros ingresos
    const otherIncomesData = [
      ['OTROS INGRESOS DEL PERIODO'],
      ['Descripción', 'Monto', 'Fecha']
    ];

    otherIncomes.forEach(income => {
      otherIncomesData.push([
        income.description,
        income.amount,
        formatDate(income.receivedAt)
      ]);
    });

    // Crear libro de Excel
    const wb = XLSX.utils.book_new();
    const wsResumen = XLSX.utils.aoa_to_sheet(resumenData);
    const wsPagos = XLSX.utils.aoa_to_sheet(pagosData);
    const wsGastos = XLSX.utils.aoa_to_sheet(gastosData);
    const wsOtherIncomes = XLSX.utils.aoa_to_sheet(otherIncomesData);

    // Ajustar anchos de columna
    wsResumen['!cols'] = [{ wch: 25 }, { wch: 20 }, { wch: 20 }, { wch: 15 }];
    wsPagos['!cols'] = [{ wch: 25 }, { wch: 18 }, { wch: 15 }, { wch: 18 }, { wch: 25 }];
    wsGastos['!cols'] = [{ wch: 40 }, { wch: 18 }, { wch: 25 }];
    wsOtherIncomes['!cols'] = [{ wch: 40 }, { wch: 18 }, { wch: 25 }];

    XLSX.utils.book_append_sheet(wb, wsResumen, 'Resumen');
    XLSX.utils.book_append_sheet(wb, wsPagos, 'Pagos');
    XLSX.utils.book_append_sheet(wb, wsGastos, 'Gastos');
    XLSX.utils.book_append_sheet(wb, wsOtherIncomes, 'Otros Ingresos');

    // Descargar archivo
    XLSX.writeFile(wb, `Acueducto_${period}.xlsx`);
  };

  return {
    downloadExcel,
  };
}
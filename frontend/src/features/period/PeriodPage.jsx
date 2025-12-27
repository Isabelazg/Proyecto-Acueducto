import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../lib/api';
import { formatCurrency, formatDateTime } from '../../lib/utils';
import * as XLSX from 'xlsx';

export function PeriodPage() {
  const { period } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [showFeeForm, setShowFeeForm] = useState(false);
  const [showExpenseForm, setShowExpenseForm] = useState(false);
  const [showIncomeForm, setShowIncomeForm] = useState(false);
  const [feeAmount, setFeeAmount] = useState('');
  const [expenseAmount, setExpenseAmount] = useState('');
  const [expenseDesc, setExpenseDesc] = useState('');
  const [incomeAmount, setIncomeAmount] = useState('');
  const [incomeDesc, setIncomeDesc] = useState('');

  const { data, isLoading } = useQuery({
    queryKey: ['period', period],
    queryFn: () => api.getPeriodSummary(period),
  });

  const setFeeMutation = useMutation({
    mutationFn: (amount) => api.setFee(period, { amount }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['period', period] });
      setFeeAmount('');
      setShowFeeForm(false);
    },
  });

  const paymentMutation = useMutation({
    mutationFn: (personId) => api.createPayment(period, { personId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['period', period] });
      queryClient.invalidateQueries({ queryKey: ['balance'] });
    },
  });

  const deletePaymentMutation = useMutation({
    mutationFn: api.deletePayment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['period', period] });
      queryClient.invalidateQueries({ queryKey: ['balance'] });
    },
  });

  const expenseMutation = useMutation({
    mutationFn: (data) => api.createExpense(period, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['period', period] });
      queryClient.invalidateQueries({ queryKey: ['balance'] });
      setExpenseAmount('');
      setExpenseDesc('');
      setShowExpenseForm(false);
    },
  });

  const deleteExpenseMutation = useMutation({
    mutationFn: api.deleteExpense,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['period', period] });
      queryClient.invalidateQueries({ queryKey: ['balance'] });
    },
  });

  const incomeMutation = useMutation({
    mutationFn: (data) => api.createOtherIncome(period, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['period', period] });
      queryClient.invalidateQueries({ queryKey: ['balance'] });
      setIncomeAmount('');
      setIncomeDesc('');
      setShowIncomeForm(false);
    },
  });

  const deleteIncomeMutation = useMutation({
    mutationFn: api.deleteOtherIncome,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['period', period] });
      queryClient.invalidateQueries({ queryKey: ['balance'] });
    },
  });

  const handleFeeSubmit = (e) => {
    e.preventDefault();
    const amount = parseInt(feeAmount);
    if (!isNaN(amount) && amount > 0) {
      setFeeMutation.mutate(amount);
    }
  };

  const handleExpenseSubmit = (e) => {
    e.preventDefault();
    const amount = parseInt(expenseAmount);
    if (!isNaN(amount) && amount > 0 && expenseDesc.trim()) {
      expenseMutation.mutate({
        amount,
        description: expenseDesc.trim(),
      });
    }
  };

  const handleIncomeSubmit = (e) => {
    e.preventDefault();
    const amount = parseInt(incomeAmount);
    if (!isNaN(amount) && amount > 0 && incomeDesc.trim()) {
      incomeMutation.mutate({
        amount,
        description: incomeDesc.trim(),
      });
    }
  };

  const handlePeriodChange = (e) => {
    navigate(`/periodo/${e.target.value}`);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  const summary = data || {};
  const people = summary.people || [];
  const expenses = summary.expenses || [];
  const otherIncomes = summary.otherIncomes || [];
  const totals = summary.totals || {};
  const paidCount = people.filter((p) => p.paid).length;

  const downloadExcel = () => {
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

    // Agregar cada persona al resumen
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

    // Agregar cada gasto al resumen
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

    // Agregar otros ingresos al resumen
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

    // Ajustar anchos de columna - Resumen
    wsResumen['!cols'] = [
      { wch: 25 },
      { wch: 20 },
      { wch: 20 },
      { wch: 15 }
    ];

    // Ajustar anchos de columna - Pagos
    wsPagos['!cols'] = [
      { wch: 25 },
      { wch: 18 },
      { wch: 15 },
      { wch: 18 },
      { wch: 25 }
    ];

    // Ajustar anchos de columna - Gastos
    wsGastos['!cols'] = [
      { wch: 40 },
      { wch: 18 },
      { wch: 25 }
    ];

    // Ajustar anchos de columna - Otros Ingresos
    wsOtherIncomes['!cols'] = [
      { wch: 40 },
      { wch: 18 },
      { wch: 25 }
    ];

    XLSX.utils.book_append_sheet(wb, wsResumen, 'Resumen');
    XLSX.utils.book_append_sheet(wb, wsPagos, 'Pagos');
    XLSX.utils.book_append_sheet(wb, wsGastos, 'Gastos');
    XLSX.utils.book_append_sheet(wb, wsOtherIncomes, 'Otros Ingresos');

    // Descargar archivo
    XLSX.writeFile(wb, `Acueducto_${period}.xlsx`);
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Periodo {period}</h1>
        <div className="flex gap-2">
          <button
            className="btn btn-neutral gap-2"
            onClick={downloadExcel}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
            Descargar Excel
          </button>
          <input
            type="month"
            className="input input-bordered"
            value={period}
            onChange={handlePeriodChange}
          />
        </div>
      </div>

      {/* Estadísticas generales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
        <div className="stats shadow">
          <div className="stat">
            <div className="stat-title">Cuota Mensual Global</div>
            <div className="stat-value text-primary text-2xl">
              {summary.feeAmount ? formatCurrency(summary.feeAmount) : '-'}
            </div>
            <div className="stat-actions">
              <button className="btn btn-sm btn-outline" onClick={() => setShowFeeForm(!showFeeForm)}>
                {summary.feeAmount ? 'Cambiar' : 'Definir'}
              </button>
            </div>
          </div>
        </div>

        <div className="stats shadow">
          <div className="stat">
            <div className="stat-title">Cuotas Pagadas</div>
            <div className="stat-value text-primary text-2xl">
              {formatCurrency(totals.monthIn || 0)}
            </div>
            <div className="stat-desc">
              {paidCount} / {people.length} pagaron
            </div>
          </div>
        </div>

        <div className="stats shadow">
          <div className="stat">
            <div className="stat-title">Otros Ingresos</div>
            <div className="stat-value text-primary text-2xl">
              {formatCurrency(totals.otherIncome || 0)}
            </div>
            <div className="stat-desc">{otherIncomes.length} registros</div>
          </div>
        </div>

        <div className="stats shadow">
          <div className="stat">
            <div className="stat-title">Egresos del Mes</div>
            <div className="stat-value text-neutral text-2xl">
              {formatCurrency(totals.monthOut || 0)}
            </div>
            <div className="stat-desc">{expenses.length} gastos</div>
          </div>
        </div>

        <div className="stats shadow">
          <div className="stat">
            <div className="stat-title">Balance Total</div>
            <div className={`stat-value text-2xl ${totals.balance >= 0 ? 'text-info' : 'text-warning'}`}>
              {formatCurrency(totals.balance || 0)}
            </div>
            <div className="stat-desc">Acumulado histórico</div>
          </div>
        </div>
      </div>

      {showFeeForm && (
        <div className="card bg-base-100 shadow-xl mb-6">
          <div className="card-body">
            <form onSubmit={handleFeeSubmit}>
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Cuota mensual (pesos colombianos)</span>
                </label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    placeholder="Ej: 50000"
                    className="input input-bordered flex-1"
                    value={feeAmount}
                    onChange={(e) => setFeeAmount(e.target.value)}
                    required
                  />
                  <button type="submit" className="btn btn-primary" disabled={setFeeMutation.isPending}>
                    {setFeeMutation.isPending ? 'Guardando...' : 'Guardar'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Pagos de personas */}
      <div className="card bg-base-100 shadow-xl mb-6">
        <div className="card-body">
          <h2 className="card-title">Pagos del Mes</h2>
          <div className="alert alert-info mb-4">
            <span>💡 La cuota global aplica a todos. Si alguien paga diferente, define su cuota individual en Personas.</span>
          </div>
          <div className="overflow-x-auto">
            <table className="table">
              <thead>
                <tr>
                  <th>Persona</th>
                  <th>Cuota a Pagar</th>
                  <th>Estado</th>
                  <th>Monto Pagado</th>
                  <th>Fecha</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {people.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="text-center py-8 text-base-content/60">
                      No hay personas activas. Ve a la sección Personas para agregar.
                    </td>
                  </tr>
                ) : (
                  people.map((person) => {
                    const feeToUse = person.monthlyFee || summary.feeAmount;
                    const hasCustomFee = Boolean(person.monthlyFee);
                    
                    return (
                      <tr key={person.id}>
                        <td>{person.name}</td>
                        <td>
                          {feeToUse ? (
                            <div className="flex items-center gap-2">
                              <span className={hasCustomFee ? 'font-semibold text-warning' : ''}>
                                {formatCurrency(feeToUse)}
                              </span>
                              {hasCustomFee && (
                                <span className="badge badge-warning badge-sm">Individual</span>
                              )}
                            </div>
                          ) : (
                            <span className="text-base-content/60 text-sm">Sin cuota</span>
                          )}
                        </td>
                        <td>
                          <span className={`badge ${person.paid ? 'badge-success' : 'badge-ghost'}`}>
                            {person.paid ? '✓ Pagado' : 'Pendiente'}
                          </span>
                        </td>
                        <td>
                          {person.payment ? formatCurrency(person.payment.amount) : '-'}
                        </td>
                        <td>
                          {person.payment ? formatDateTime(person.payment.paidAt) : '-'}
                        </td>
                        <td>
                          {person.paid ? (
                            <button
                              className="btn btn-sm btn-error btn-outline"
                              onClick={() => deletePaymentMutation.mutate(person.payment.id)}
                              disabled={deletePaymentMutation.isPending}
                            >
                              Eliminar
                            </button>
                          ) : (
                            <button
                              className="btn btn-sm btn-primary"
                              onClick={() => paymentMutation.mutate(person.id)}
                              disabled={paymentMutation.isPending || !feeToUse}
                              title={!feeToUse ? 'Define la cuota global o individual primero' : ''}
                            >
                              Registrar Pago
                            </button>
                        )}
                      </td>
                    </tr>
                  );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Gastos */}
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <div className="flex justify-between items-center mb-4">
            <h2 className="card-title">Gastos del Mes</h2>
            <button
              className="btn btn-sm btn-neutral"
              onClick={() => setShowExpenseForm(!showExpenseForm)}
            >
              {showExpenseForm ? 'Cancelar' : '+ Agregar Gasto'}
            </button>
          </div>

          {showExpenseForm && (
            <form onSubmit={handleExpenseSubmit} className="mb-4 p-4 bg-base-200 rounded-lg">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Descripción</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Ej: Reparación bomba"
                    className="input input-bordered"
                    value={expenseDesc}
                    onChange={(e) => setExpenseDesc(e.target.value)}
                    required
                  />
                </div>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Monto</span>
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      placeholder="Ej: 120000"
                      className="input input-bordered flex-1"
                      value={expenseAmount}
                      onChange={(e) => setExpenseAmount(e.target.value)}
                      required
                    />
                    <button type="submit" className="btn btn-neutral" disabled={expenseMutation.isPending}>
                      {expenseMutation.isPending ? 'Guardando...' : 'Guardar'}
                    </button>
                  </div>
                </div>
              </div>
            </form>
          )}

          <div className="overflow-x-auto">
            <table className="table">
              <thead>
                <tr>
                  <th>Descripción</th>
                  <th>Monto</th>
                  <th>Fecha</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {expenses.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="text-center py-8 text-base-content/60">
                      No hay gastos registrados este mes
                    </td>
                  </tr>
                ) : (
                  expenses.map((expense) => (
                    <tr key={expense.id}>
                      <td>{expense.description}</td>
                      <td className="text-error font-semibold">
                        {formatCurrency(expense.amount)}
                      </td>
                      <td>{formatDateTime(expense.spentAt)}</td>
                      <td>
                        <button
                          className="btn btn-sm btn-error btn-outline"
                          onClick={() => deleteExpenseMutation.mutate(expense.id)}
                          disabled={deleteExpenseMutation.isPending}
                        >
                          Eliminar
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Otros Ingresos */}
      <div className="card bg-base-100 shadow-xl mt-6">
        <div className="card-body">
          <div className="flex justify-between items-center mb-4">
            <h2 className="card-title">Otros Ingresos</h2>
            <button
              className="btn btn-sm btn-neutral"
              onClick={() => setShowIncomeForm(!showIncomeForm)}
            >
              {showIncomeForm ? 'Cancelar' : '+ Agregar Ingreso'}
            </button>
          </div>

          {showIncomeForm && (
            <form onSubmit={handleIncomeSubmit} className="mb-4 p-4 bg-base-200 rounded-lg">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Descripción</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Ej: Donación, Subsidio, etc."
                    className="input input-bordered"
                    value={incomeDesc}
                    onChange={(e) => setIncomeDesc(e.target.value)}
                    required
                  />
                </div>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Monto</span>
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      placeholder="Ej: 50000"
                      className="input input-bordered flex-1"
                      value={incomeAmount}
                      onChange={(e) => setIncomeAmount(e.target.value)}
                      required
                    />
                    <button type="submit" className="btn btn-neutral" disabled={incomeMutation.isPending}>
                      {incomeMutation.isPending ? 'Guardando...' : 'Guardar'}
                    </button>
                  </div>
                </div>
              </div>
            </form>
          )}

          <div className="overflow-x-auto">
            <table className="table">
              <thead>
                <tr>
                  <th>Descripción</th>
                  <th>Monto</th>
                  <th>Fecha</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {otherIncomes.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="text-center py-8 text-base-content/60">
                      No hay otros ingresos registrados este mes
                    </td>
                  </tr>
                ) : (
                  otherIncomes.map((income) => (
                    <tr key={income.id}>
                      <td>{income.description}</td>
                      <td className="text-info font-semibold">
                        {formatCurrency(income.amount)}
                      </td>
                      <td>{formatDateTime(income.receivedAt)}</td>
                      <td>
                        <button
                          className="btn btn-sm btn-error btn-outline"
                          onClick={() => deleteIncomeMutation.mutate(income.id)}
                          disabled={deleteIncomeMutation.isPending}
                        >
                          Eliminar
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

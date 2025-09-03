// admin.js — Render y lógica del dashboard Admin
import { goToScreen } from './navigation.js';

export function initializeAdmin(appState) {
  // Saludo
  const greeting = document.getElementById('admin-greeting');
  if (greeting && appState?.businessName) {
    greeting.textContent = `¡Hola, ${appState.ownerName || 'Admin'}!`;
  }

  // KPIs demo (podrás conectar a tus datos reales)
  const sales = 8750;     // ventas del día
  const expenses = 1840;  // gastos del día
  const profit = sales - expenses;

  setText('kpi-sales', money(sales));
  setText('kpi-expenses', money(expenses));
  setText('kpi-profit', money(profit));
  setText('kpi-sales-diff', '▲ 12% vs ayer');
  setText('kpi-expenses-diff', '▼ 5% vs ayer');
  setText('kpi-profit-tag', profit >= 0 ? 'Ganancia' : 'Pérdida');

  // Salud del negocio (sencillo: margen/ventas)
  const margin = sales ? profit / sales : 0;
  const health = document.getElementById('health-pill');
  const healthText = document.getElementById('health-text');
  if (health && healthText) {
    if (margin >= 0.25) {
      health.querySelector('.dot').style.background = 'var(--success-color)';
      healthText.textContent = 'Salud: Excelente';
    } else if (margin >= 0.1) {
      health.querySelector('.dot').style.background = '#f59e0b'; // ámbar
      healthText.textContent = 'Salud: Buena';
    } else if (margin >= 0) {
      health.querySelector('.dot').style.background = '#f59e0b';
      healthText.textContent = 'Salud: Ajustada';
    } else {
      health.querySelector('.dot').style.background = 'var(--danger-color)';
      healthText.textContent = 'Salud: En riesgo';
    }
  }

  // === Gráfico de Ventas vs Gastos (líneas) ===
  const perfChart = document.getElementById('admin-chart');
  if (perfChart) {
    import('https://cdn.jsdelivr.net/npm/chart.js').then(({ Chart }) => {
      new Chart(perfChart, {
        type: 'line',
        data: {
          labels: ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'],
          datasets: [
            {
              label: 'Ventas',
              data: [2500, 3000, 2800, 4000, 3700, 4500, 4200],
              borderColor: '#58B4E9',
              backgroundColor: 'rgba(88,180,233,0.2)',
              tension: 0.3,
              fill: true
            },
            {
              label: 'Gastos',
              data: [1200, 1500, 1000, 2000, 1800, 1600, 1700],
              borderColor: '#F2A649',
              backgroundColor: 'rgba(242,166,73,0.2)',
              tension: 0.3,
              fill: true
            }
          ]
        },
        options: {
          responsive: true,
          plugins: {
            legend: { position: 'bottom' }
          },
          scales: {
            y: { beginAtZero: true }
          }
        }
      });
    });
  }

  // === Gráfico semanal de ventas (barras) ===
  const weeklyChart = document.getElementById('ventasChart');
  if (weeklyChart) {
    const ventasSemana = [500, 700, 450, 900, 1200, 800, 600]; // demo
    new Chart(weeklyChart, {
      type: "bar",
      data: {
        labels: ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"],
        datasets: [{
          label: "Ventas (C$)",
          data: ventasSemana,
          backgroundColor: "#ff6600"
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { display: false }
        }
      }
    });
  }

  // Sucursales (demo)
const branchesRow = document.getElementById('branches-row');
if (branchesRow) {
  const branches = [
    { icon: '🏬', name: 'Sucursal Principal', openCash: 2, salesToday: 3450, screen: 20 },
    { icon: '📦', name: 'Bodega Mercado',    openCash: 1, salesToday: 1520, screen: 21 },
  ];

  branchesRow.innerHTML = branches.map(b => `
    <div class="alert-card">
      <div class="alert-main">
        <div class="alert-ico">${b.icon}</div>
        <div class="alert-text">
          <div class="title">${b.name}</div>
          <div class="sub">${b.openCash} cajas abiertas · Hoy ${money(b.salesToday)}</div>
        </div>
      </div>
      <div class="alert-actions">
        <button class="promo-button" data-screen="${b.screen}">Ver cajas</button>
      </div>
    </div>
  `).join('');
}
  // Botón para crear nueva sucursal
  const addBranchBtn = document.getElementById('add-branch');
  if (addBranchBtn) {
    addBranchBtn.addEventListener('click', () => {
      alert("Crear nueva sucursal (formulario/modal)");
    });
  }

  // Cajas (demo)
  const cashList = document.getElementById('cash-register-list');
  const cashItems = [
    { name: 'Caja #1', employee: 'Carlos', status: 'open',   sales: 2100 },
    { name: 'Caja #2', employee: 'María',  status: 'open',   sales: 1350 },
    { name: 'Caja #3', employee: 'Luisa',  status: 'closed', sales: 0    },
  ];
  if (cashList) renderCash(cashList, cashItems, 'all');

  // Filtro de Cajas
  document.querySelectorAll('[data-cash-filter]').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('[data-cash-filter]').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const mode = btn.dataset.cashFilter;
      renderCash(cashList, cashItems, mode);
    });
  });

  // Alertas (resumidas)
  const alertsGrid = document.getElementById('alerts-grid');
  if (alertsGrid) {
    const alertsSummary = [
      { icon:'⚠️', title:'Stock bajo', count:3, action:{label:'Ver lista', screen:15} },
      { icon:'⏳', title:'Por vencer', count:2, action:{label:'Revisar', screen:15} },
      { icon:'💸', title:'Por pagar',  count:1, action:{label:'Pagar', screen:14} },
      { icon:'🧾', title:'Por cobrar', count:2, action:{label:'Cobrar', screen:13} },
      { icon:'🧾', title:'Pedidos Pendintes', count:2, action:{label:'Pedidos', screen:13} },
    ];
    alertsGrid.innerHTML = alertsSummary.map(a => `
      <div class="alert-card">
        <div class="alert-main">
          <div class="alert-ico">${a.icon}</div>
          <div class="alert-text">
            <div class="title">${a.title}</div>
            <div class="sub">${a.count} pendientes</div>
          </div>
        </div>
        <div class="alert-actions">
          <button class="promo-button" data-screen="${a.action.screen}">${a.action.label}</button>
        </div>
      </div>
    `).join('');
  }

  // Navegación por KPIs (tappable)
  document.querySelectorAll('.kpi-card').forEach(card => {
    card.addEventListener('click', () => {
      const target = card.getAttribute('data-screen');
      if (target) goToScreen(parseInt(target, 10));
    });
  });
}

/* Utils */
function setText(id, text){ 
  const el = document.getElementById(id); 
  if (el) el.textContent = text; 
}

function money(n){ 
  return `C$ ${Number(n).toLocaleString('es-NI')}`; 
}

function renderCash(container, items, mode) {
  if (!container) return;
  const filtered = mode === 'all' ? items : items.filter(i => i.status === mode);
  container.innerHTML = filtered.map(i => `
    <div class="cash-register-card">
      <div class="left">
        <div class="cash-avatar">${i.employee.charAt(0).toUpperCase()}</div>
        <div class="meta">
          <div class="name">${i.name}</div>
          <div class="employee">${i.employee}</div>
        </div>
      </div>
      <div class="right">
        <span class="status ${i.status === 'open' ? 'open' : 'closed'}">${i.status === 'open' ? 'Abierta' : 'Cerrada'}</span>
        <div class="value" style="text-align:right; font-weight:800; margin-top:4px;">
          ${i.sales ? money(i.sales) : ''}
        </div>
      </div>
    </div>
  `).join('');
}

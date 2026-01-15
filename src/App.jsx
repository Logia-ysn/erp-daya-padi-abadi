import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from '@/contexts/AuthContext';
import { DashboardShell } from '@/components/layout';
import {
  LoginPage,
  DashboardPage,
  ProcurementPage,
  ProductionPage,
  InventoryPage,
  MaintenancePage,
  SalesPage,
  FinancePage,
  SettingsPage,
} from '@/pages';

// Production Module
import {
  WorksheetPage,
  PerformancePage,
  UptimePage,
  DowntimePage,
  OeePage,
  StockPage,
  MaintenanceProductionPage,
  CogmPage,
} from '@/pages/production';

// Sales Module
import {
  RevenuePage,
  InvoicesPage,
  PicPage,
} from '@/pages/sales';

// Finance Module
import {
  ExpensesPage,
  CogmAnalysisPage,
} from '@/pages/finance';

// HRD Module
import {
  AttendancePage,
  PerformanceHrdPage,
  DemographyPage,
} from '@/pages/hrd';

import '@/i18n';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route element={<DashboardShell />}>
            {/* Dashboard */}
            <Route path="/" element={<DashboardPage />} />

            {/* Legacy routes (for backward compatibility) */}
            <Route path="/procurement" element={<ProcurementPage />} />
            <Route path="/production" element={<ProductionPage />} />
            <Route path="/inventory" element={<InventoryPage />} />
            <Route path="/maintenance" element={<MaintenancePage />} />
            <Route path="/sales" element={<SalesPage />} />
            <Route path="/finance" element={<FinancePage />} />

            {/* Production Module */}
            <Route path="/production/worksheet" element={<WorksheetPage />} />
            <Route path="/production/performance" element={<PerformancePage />} />
            <Route path="/production/uptime" element={<UptimePage />} />
            <Route path="/production/downtime" element={<DowntimePage />} />
            <Route path="/production/oee" element={<OeePage />} />
            <Route path="/production/stock" element={<StockPage />} />
            <Route path="/production/maintenance" element={<MaintenanceProductionPage />} />
            <Route path="/production/cogm" element={<CogmPage />} />

            {/* Sales Module */}
            <Route path="/sales/revenue" element={<RevenuePage />} />
            <Route path="/sales/invoices" element={<InvoicesPage />} />
            <Route path="/sales/pic" element={<PicPage />} />

            {/* Finance Module */}
            <Route path="/finance/expenses" element={<ExpensesPage />} />
            <Route path="/finance/cogm-analysis" element={<CogmAnalysisPage />} />

            {/* HRD Module */}
            <Route path="/hrd/attendance" element={<AttendancePage />} />
            <Route path="/hrd/performance" element={<PerformanceHrdPage />} />
            <Route path="/hrd/demography" element={<DemographyPage />} />

            {/* Settings */}
            <Route path="/settings" element={<SettingsPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;

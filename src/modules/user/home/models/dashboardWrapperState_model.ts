
interface IDashboardWrapperState {
    dashboards: IDashboard[];
    selectedDashboard: IDashboard;
    isMobileMenuOpen: boolean;
};

interface IDashboard {
    id: number;
    name: string;
    children: string[];
};

export type { IDashboard };
export default IDashboardWrapperState;
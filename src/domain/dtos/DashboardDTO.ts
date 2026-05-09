export interface UpcomingMaintenanceDTO {
  id: number;
  uuid: string;
  scheduledDate: Date;
  scheduledTime: string;
  clientName: string;
  serviceName: string;
  operatorName: string;
  statusName: string;
}

export interface DashboardStatsDTO {
  upcomingMaintenances: UpcomingMaintenanceDTO[];
  // Aquí podemos agregar más estadísticas (total de clientes, mantenimientos cerrados, etc.) en el futuro
}

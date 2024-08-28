// models.ts

export interface LeaveDetail {
    period: string; // E.g., 'M', 'A', 'N'
    leaveType: string; // E.g., 'sick', 'personal'
}

export interface LeaveEntry {
    date: string; // Date in 'dd-MM-yyyy' format
    leaveDetails: {
        [employeeName: string]: LeaveDetail[]; // Dictionary with employee names as keys
    };
}

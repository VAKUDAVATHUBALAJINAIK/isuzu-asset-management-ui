
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

interface EmployeeRecord {
  id: number;
  employeeId: string;
  name: string;
  initials: string;
  designation: string;
  department: string;
  branch: string;
  mobile: string;
  email: string;
  active: boolean;
}

@Component({
  selector: 'app-employee',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './employee.html',
  styleUrl: './employee.scss'
})
export class Employee {
  searchText = '';
  selectedDepartment = '';
  pageSize = 8;
  currentPage = 1;

  showForm = false;
  modalMode: 'add' | 'edit' | 'view' = 'add';
  selectedEmployee: EmployeeRecord | null = null;

  employees: EmployeeRecord[] = [
    { id: 1, employeeId: 'EMP001', name: 'Nigar Sultana', initials: 'NI', designation: 'IT Engineer', department: 'IT', branch: 'Dhaka HQ', mobile: '01833445566', email: 'nigar.sultana@example.com', active: true },
    { id: 2, employeeId: 'EMP002', name: 'Fariqur Islam', initials: 'FH', designation: 'Team Lead', department: 'Sales', branch: 'Sylhet', mobile: '01874055678', email: 'fariqur.islam@example.com', active: false },
    { id: 3, employeeId: 'EMP003', name: 'Niger Sultana', initials: 'NS', designation: 'Software Engineer', department: 'IT', branch: 'Dhaka HQ', mobile: '01999556677', email: 'niger.sultana@example.com', active: true },
    { id: 4, employeeId: 'EMP004', name: 'Anisur Rahman', initials: 'AR', designation: 'Finance Executive', department: 'Finance', branch: 'Dhaka HQ', mobile: '01734567890', email: 'anisur.rahman@example.com', active: true },
    { id: 5, employeeId: 'EMP005', name: 'Laila Hasan', initials: 'LH', designation: 'Assistant Manager', department: 'HR', branch: 'Dhaka HQ', mobile: '01844556677', email: 'laila.hasan@example.com', active: false },
    { id: 6, employeeId: 'EMP006', name: 'Farhan Chowdhury', initials: 'FC', designation: 'Network Engineer', department: 'IT', branch: 'Chittagong', mobile: '01744556677', email: 'farhan.c@example.com', active: true },
    { id: 7, employeeId: 'EMP007', name: 'Sumiya Yasmin', initials: 'SY', designation: 'Support Lead', department: 'Support', branch: 'Chittagong', mobile: '01633445570', email: 'sumiya.y@example.com', active: true },
    { id: 8, employeeId: 'EMP008', name: 'Irfan Mahmud', initials: 'IM', designation: 'Developer', department: 'IT', branch: 'Dhaka HQ', mobile: '01999887766', email: 'irfan.m@example.com', active: true }
  ];

  form: EmployeeRecord = this.emptyEmployee();

  get departments(): string[] {
    return [...new Set(this.employees.map(e => e.department))].sort();
  }

  get filteredEmployees(): EmployeeRecord[] {
    const search = this.searchText.trim().toLowerCase();

    return this.employees.filter(employee => {
      const matchesSearch = !search || [
        employee.name,
        employee.employeeId,
        employee.department,
        employee.designation,
        employee.email
      ].some(value => value.toLowerCase().includes(search));

      const matchesDepartment =
        !this.selectedDepartment ||
        employee.department === this.selectedDepartment;

      return matchesSearch && matchesDepartment;
    });
  }

  get totalPages(): number {
    return Math.max(1, Math.ceil(this.filteredEmployees.length / this.pageSize));
  }

  get paginatedEmployees(): EmployeeRecord[] {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.filteredEmployees.slice(start, start + this.pageSize);
  }

  get showingStart(): number {
    return this.filteredEmployees.length
      ? (this.currentPage - 1) * this.pageSize + 1
      : 0;
  }

  get showingEnd(): number {
    return Math.min(this.currentPage * this.pageSize, this.filteredEmployees.length);
  }

  private emptyEmployee(): EmployeeRecord {
    return {
      id: 0,
      employeeId: '',
      name: '',
      initials: '',
      designation: '',
      department: '',
      branch: '',
      mobile: '',
      email: '',
      active: true
    };
  }

  onFilterChange(): void {
    this.currentPage = 1;
  }

  openAdd(): void {
    this.modalMode = 'add';
    this.form = this.emptyEmployee();
    this.form.employeeId = this.generateEmployeeId();
    this.showForm = true;
  }

  openEdit(employee: EmployeeRecord): void {
    this.modalMode = 'edit';
    this.form = { ...employee };
    this.showForm = true;
  }

  openView(employee: EmployeeRecord): void {
    this.modalMode = 'view';
    this.form = { ...employee };
    this.showForm = true;
  }

  closeForm(): void {
    this.showForm = false;
  }

  saveEmployee(): void {
    if (!this.form.name.trim() ||
        !this.form.department ||
        !this.form.designation.trim()) {
      return;
    }

    const employee = {
      ...this.form,
      name: this.form.name.trim(),
      initials: this.form.name.trim()
        .split(/\s+/)
        .map(part => part[0])
        .join('')
        .slice(0, 2)
        .toUpperCase()
    };

    if (this.modalMode === 'edit') {
      this.employees = this.employees.map(e =>
        e.id === employee.id ? employee : e
      );
    } else {
      employee.id = Math.max(0, ...this.employees.map(e => e.id)) + 1;
      employee.employeeId = this.generateEmployeeId();
      this.employees = [employee, ...this.employees];
      this.currentPage = 1;
    }

    this.closeForm();
  }

  deleteEmployee(employee: EmployeeRecord): void {
    if (!confirm(`Delete ${employee.name} (${employee.employeeId})?`)) {
      return;
    }

    this.employees = this.employees.filter(e => e.id !== employee.id);
    this.currentPage = Math.min(this.currentPage, this.totalPages);
  }

  toggleStatus(employee: EmployeeRecord): void {
    this.employees = this.employees.map(e =>
      e.id === employee.id ? { ...e, active: !e.active } : e
    );
  }

  changePage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  private generateEmployeeId(): string {
    const maxId = Math.max(
      0,
      ...this.employees.map(e => Number(e.employeeId.replace('EMP', '')) || 0)
    );
    return `EMP${String(maxId + 1).padStart(3, '0')}`;
  }

  exportExcel(): void {
    const headers = [
      'Employee ID', 'Name', 'Designation', 'Department',
      'Branch', 'Mobile', 'Email', 'Status'
    ];

    const rows = this.filteredEmployees.map(e => [
      e.employeeId, e.name, e.designation, e.department,
      e.branch, e.mobile, e.email, e.active ? 'Active' : 'Inactive'
    ]);

    const csv = [headers, ...rows]
      .map(row => row.map(value =>
        `"${String(value).replace(/"/g, '""')}"`
      ).join(','))
      .join('\r\n');

    const blob = new Blob(['\uFEFF' + csv], {
      type: 'text/csv;charset=utf-8;'
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'employees.csv';
    link.click();
    URL.revokeObjectURL(url);
  }

  exportPdf(): void {
    window.print();
  }

  importFile(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (file) {
      alert(`Selected "${file.name}". Excel import will be connected next.`);
      input.value = '';
    }
  }
}

import { Component } from '@angular/core';

@Component({
  selector: 'app-project-management',
  templateUrl: './project-management.component.html',
  styleUrls: ['./project-management.component.scss']
})
export class ProjectManagementComponent {
  // Add these properties and methods that were missing
  searchTerm: string = '';  // Search term for filtering projects
  showPopup: boolean = false;  // Popup visibility
  isEditing: boolean = false;  // Track if we're editing or adding a project
  currentProject: any = {};  // Hold the current project data for editing or adding

  // Mock project data
  projects = [
    { id: 1, name: 'Project A', type: 'Type 1', status: 'Active', startDate: '2023-01-01', endDate: '2023-12-31', price: 10000, psCost: 5000 },
    { id: 2, name: 'Project B', type: 'Type 2', status: 'Inactive', startDate: '2023-03-01', endDate: '2023-08-31', price: 20000, psCost: 10000 }
  ];

  filteredProjects = this.projects;  // Initially, all projects are shown

  // Method to filter projects by search term
  filterProjects() {
    if (this.searchTerm) {
      this.filteredProjects = this.projects.filter(project =>
        project.name.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    } else {
      this.filteredProjects = this.projects;
    }
  }

  // Method to open the popup for adding a project
  openAddPopup() {
    this.currentProject = {};  // Clear the form
    this.isEditing = false;  // Set to adding mode
    this.showPopup = true;
  }

  // Method to open the popup for editing a project
  openEditPopup(project: any) {
    this.currentProject = { ...project };  // Load project data into the form
    this.isEditing = true;  // Set to editing mode
    this.showPopup = true;
  }

  // Method to save the project (either adding or editing)
  saveProject() {
    if (this.isEditing) {
      // Find and update the project
      const index = this.projects.findIndex(p => p.id === this.currentProject.id);
      this.projects[index] = { ...this.currentProject };
    } else {
      // Assign a new ID and add the new project
      this.currentProject.id = this.projects.length + 1;
      this.projects.push(this.currentProject);
    }
    this.closePopup();
  }

  // Method to delete a project by ID
  deleteProject(id: number) {
    this.projects = this.projects.filter(project => project.id !== id);
    this.closePopup();
  }

  // Method to confirm and delete the project
  confirmDelete(id: number) {
    if (confirm('Are you sure you want to delete this project?')) {
      this.deleteProject(id);
    }
  }

  // Method to close the popup
  closePopup() {
    this.showPopup = false;
  }
}
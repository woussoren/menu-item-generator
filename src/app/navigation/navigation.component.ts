import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.css']
})
export class NavigationComponent implements OnInit {

  name = 'DMO\\JIVC\\C4I&I\\SATS\\SYSMGT 1';

  items: MenuItem[];
  sub: any;

  organizationStructure = [
    {department: 'DMO', workspace: 'swr000001'},
    {department: 'DMO\\JIVC', workspace: 'swr000002'},
    {department: 'DMO\\JIVC\\EC', workspace: 'swr000002'},
    {department: 'DMO\\JIVC\\BOO IT', workspace: 'swr000002'},
    {department: 'DMO\\JIVC\\C4I&I\\BDFV', workspace: 'swr000002'},
    {department: 'DMO\\JIVC\\C4I&I\\IS', workspace: 'swr000002'},
    {department: 'DMO\\JIVC\\C4I&I\\SATS\\SYSMGT 1', workspace: 'swr000002'},
    {department: 'DMO\\MATLOG', workspace: 'swr000002'},
  ];

  constructor(
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.name = this.route.snapshot.params['afdeling'];
    this.selectDept(this.name);
    this.sub = this.route.params.subscribe(params => {
      this.name = params['afdeling'];
      this.selectDept(this.name);
    })
  }

  selectDept(name: string) {
    this.items = [];
    this.name = name;
    this.items = [this.getUpper(name, this.organizationStructure)];
    this.items.push({separator:true});
    this.items.push ({
      label: this.getDepartmentName(name, this.getHierarchicalLevel(name)),
      icon: 'pi pi-fw pi-home',
      disabled: true
    })
    this.items.push({separator:true});
    let items2push = this.createMenuItems(name, this.organizationStructure, 1)
    this.items.push(...items2push);
  }

  private getUpper(
      currentDepartment: string,
      organizationStructure: {department: string, workspace: string} []
    ): MenuItem {

    let depLevel = this.getHierarchicalLevel(currentDepartment);
    let founditem = undefined

    while (depLevel > 1 && founditem === undefined ) {
      let dept2check = this.getDepartmentFullPath(currentDepartment, depLevel - 1);
      founditem = organizationStructure.find( item => item.department === dept2check);
      depLevel -= 1;
    }

    if (founditem === undefined) {
      return {
        label: 'Geen bovenliggende',
        icon: 'pi pi-fw pi-ban',
        disabled: true
      }      
    } else {
      return {
        label: this.getDepartmentName(founditem.department, this.getHierarchicalLevel(founditem.department)),
        icon: 'pi pi-fw pi-arrow-up',
        command: (event) => {this.selectDept(founditem.department)}
      }
    }
    
  }
  
  private createMenuItems(
    currentdepartment: string,
    organizationStructure: {department: string, workspace: string}[],
    level: number): MenuItem[] {
    const menuitems = [];
    let itemstoskip = '';

    // Sort organizationstructure by department
    let organizationstructure = [...organizationStructure].sort( (a, b) => {
      if (a.department > b.department) {return 1; }
      if (a.department < b.department) {return -1; }
      return 0;
    });

    // Filter departments to exclude items outside scope currentdepartment
    organizationstructure = organizationstructure.filter(item => {
      return item.department.startsWith(currentdepartment + '\\');
    });
    // Loop through each department below current department
    for (const item of organizationstructure) {
      // If item's department is directly below current then add link to workspace and
      // skip the rest of items starting with items department.
      if (this.getHierarchicalLevel(currentdepartment) + 1 === this.getHierarchicalLevel(item.department) &&
        (itemstoskip === '' || !item.department.startsWith(itemstoskip))) {
          console.log('Level ' + level + ':Workspace found for ' +
            item.department + ', adding link');
          //the rest of the items starting with this department can be skipped
          itemstoskip = item.department
          menuitems.push ({
            label: this.getDepartmentName(item.department, this.getHierarchicalLevel(currentdepartment) + 1),
            icon: 'pi pi-fw pi-sign-out',
            // url: item.workspace
            // command: (event) => {this.selectDept(item.department)},
            routerLink: ['/navigation', item.department],
            // url: 'https://menu-item-generator.stackblitz.io/navigation' + item.department,
            title: item.workspace
          });
        // If item's department is not directly below current department and doesnt start with departments
        // to skip, add a submenu item and fill that for that department, skip all other entries starting
        // with that department
      } else if (itemstoskip === '' || !item.department.startsWith(itemstoskip)) {
        console.log('Level ' + level + ':No workspace found for ' +
          this.getDepartmentFullPath(item.department, this.getHierarchicalLevel(currentdepartment) + 1) +
          ', adding submenu');
        const hierarchicallevel = this.getHierarchicalLevel(currentdepartment) + 1;
        const newdepartmentpath = this.getDepartmentFullPath(item.department, hierarchicallevel);
        //the rest of the items starting with the submenu's department can be skipped
        itemstoskip = newdepartmentpath;
        menuitems.push ({
          label: this.getDepartmentName(item.department, hierarchicallevel),
          icon: 'pi pi-fw pi-angle-double-right',
          items: this.createMenuItems(newdepartmentpath, organizationstructure, level + 1)
        });
      }
    }
    if (menuitems.length > 0) {
      return menuitems;
    } else {
      return [{
        label: 'Geen onderliggende',
        icon: 'pi pi-fw pi-ban',
        disabled: true
      }]       
    }
  }

  // Return the hierarchical level, 1 is highest, 2 is below etc.
  private getHierarchicalLevel(department: string) {
    return department.split('\\').length;
  }

  // Return the department name from a organizational path by level, without the path
  private getDepartmentName(department: string, level: number) {
    return department.split('\\')[level - 1];
  }

  // Return the department name from a organizational path by level, with  the path
  private getDepartmentFullPath(department: string, level: number) {
    const departments = department.split('\\');
    return departments.splice(0, level).join('\\');
  }


}
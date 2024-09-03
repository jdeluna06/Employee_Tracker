import inquirer from 'inquirer';
import pool from './db/connection';

function app():void{
  inquirer.prompt({
    type: 'list',
    name: 'action',
    message: 'What would you like to do?',
    choices: [
      'View all departments',
      'View all roles',
      'View all employees',
      'Add a department',
      'Add a role',
      'Add an employee',
      'Update an employee role',
      'Quit'
    ]
  }).then(({action}) => {
    switch(action){
      case 'View all departments':
        viewDepartments();
        break;
      case 'View all roles':
        viewRoles();
        break;
      case 'View all employees':
        viewEmployees();
        break;
      case 'Add a department':
        addDepartment();
        break;
      case 'Add a role':
        addRole();
        break;
      case 'Add an employee':
        addEmployee();
        break;
      case 'Update an employee role':
        updateEmployeeRole();
        break;
      case 'Quit':
        pool.end();
        break;
    }
  });
  
}
async function  viewEmployees():Promise<void>{
  const sql = `SELECT employee.id, employee.first_name AS "first name",
   employee.last_name AS "last name", role.title, department.name AS department,
    role.salary, manager.first_name || ' ' || manager.last_name AS manager 
    FROM employee 
    LEFT JOIN role ON employee.role_id = role.id 
    LEFT JOIN department ON role.department_id = department.id 
    LEFT JOIN employee manager ON manager.id = employee.manager_id`;
  const employees = await pool.query(sql);
  console.table(employees.rows);
  app();
}

async function viewAllDepartments(): Promise<void> {
  const sql = `SELECT * FROM department`;
  const departments = await pool.query(sql);
  console.table(departments.rows);
  app();
}

async function  viewAllRoles():Promise<void>{
  const sql = `SELECT role.id, role.title, department.name AS department, role.salary 
    FROM role 
    LEFT JOIN department ON role.department_id = department.id`;
  const roles = await pool.query(sql);
  console.table(roles.rows);
  app();
}

async function addDepartment(): Promise<void> {
  const roles = await pool.query("SELECT id as value, title as name as name FROM role");
  inquirer.prompt([

    {
      type: 'input',
      name: 'first_name',
      message: 'What is the name of the department?'
    }
    {
      type: 'input',
      name: 'last_name',
      message: 'What is the last name of the department?'
    }
  ]).then(({name}) => {
    pool.query('INSERT INTO department (name) VALUES ($1)', [name]);
    app();
  });

  ]);
}
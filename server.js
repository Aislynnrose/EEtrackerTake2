const inquirer = require("inquirer");
const mysql = require("mysql");
const util = require("util");

let config;

if (process.env.JAWSDB_URL) {
    config = process.env.JAWSDB_URL;
} else {
    config = {
        host: "localhost",
        port: 3306,
        user: "root",
        password: "password",
        database: "employee_db",
    };
}

function makeDb(config) {
    const connection = mysql.createConnection(config);
    return {
        query(sql, args) {
            return util.promisify(connection.query).call(connection, sql, args);
        },
        close() {
            return util.promisify(connection.end).call(connection);
        },
    };
}
const db = makeDb(config);


const init = () => {
    inquirer
        .prompt([
            {
                type: "list",
                name: "initiate",
                message: "Please select from the following:",
                choices: [
                    "View all departments",
                    "View all roles",
                    "View all employees",
                    "Add a new employee",
                    "Add a new department",
                    "Add a new role",
                    "Update an employee's role",
                    "Exit",
                ],
            },
        ])
        .then((answer) => {
            switch (answer.initiate) {
                case "View all departments":
                    viewAllDepartments();
                    break;
                case "View all roles":
                    viewAllRoles();
                    break;
                case "View all employees":
                    viewAllEEs();
                    break;
                case "Add a new department":
                    addDepartment();
                    break;
                case "Add a new role":
                    addRole();
                    break;
                case "Add a new employee":
                    addEE();
                    break;
                case "Update an employee's role":
                    updateEE();
                    break;
                case "Exit":
                    process.exit();
                    break;
            }
        });
};

const viewAllDepartments = () => {
    const query = "SELECT * FROM department_table;";
    db.query(query, (err, res) => {
        if (err) throw err;
        console.table(res);
        init();
    });
};

const viewAllRoles = () => {
    const query = "SELECT * FROM role_table;";
    db.query(query, (err, res) => {
        if (err) throw err;
        console.table(res);
        init();
    });
};


const viewAllEEs = () => {
    const query = "SELECT * FROM employee_table;";
    db.query(query, (err, res) => {
        if (err) throw err;
        console.table(res);
        init();
    });
};

const addDepartment = async () => {
    inquirer
        .prompt({
            name: "dept",
            type: "input",
            message: "Enter name of the new department:",
        })
        .then(async (answer) => {
            try {
                const deptQuery = `INSERT INTO department_table (department_name) VALUES (?);`;
                const departmentData = await db.query(deptQuery, answer.dept);
                console.log(
                    `${answer.dept} has been added to the department list!`
                );
                console.table(deptQuery);
                init();
            } catch (err) {
                console.log(err);
            }
        });
};

const addRole = async () => {
    const deptQuery = "SELECT * FROM department_table";
    let departmentData;
    try {
        departmentData = await db.query(deptQuery);
    } catch (err) {
        console.log(err);
    }
    inquirer
        .prompt([
            {
                name: "roleTitle",
                type: "input",
                message: "Enter title of the new role:",
            },
            {
                name: "roleSalary",
                type: "input",
                message: "Enter salary of the new role:",
                validate: function (value) {
                    if (isNaN(value) === false) {
                        return true;
                    }
                    return false;
                },
            },
            {
                name: "roleDepartment",
                type: "rawlist",
                message: "Select department for the new role:",
                choices: function () {
                    return departmentData.map((dept) => dept.id + " " + dept.department_name);
                },
            },
        ])
        .then(async (answer) => {
            console.log(answer.roleDepartment.slice(0, 1));
            let deptID;
            try {
                for (let i = 0; i < departmentData.length; i++) {
                    if (departmentData[i].id == answer.roleDepartment.slice(0, 1)) {
                        deptID = departmentData[i].id;
                        console.log("departmentData", departmentData);
                    }
                }
                const query = `INSERT INTO role_table (title, salary, department_id)
      VALUES (?, ?, ?)`;
                const data = await db.query(query, [
                    answer.roleTitle,
                    answer.roleSalary,
                    deptID,
                ]);
                console.log(
                    `${answer.roleTitle} has been successfully added as a role!`
                );
                init();
            } catch (err) {
                console.log(err);
            }
        });
};

const addEE = async () => {
    const employeeQuery = "SELECT * FROM employee_table";
    const roleQuery = "SELECT * FROM role_table";
    let employeeData;
    let roleData;
    try {
        employeeData = await db.query(employeeQuery);
        roleData = await db.query(roleQuery);
    } catch (err) {
        console.log(err);
    }
    inquirer
        .prompt([
            {
                name: "firstName",
                type: "input",
                message: "Enter first name of new employee:",
            },
            {
                name: "lastName",
                type: "input",
                message: "Enter last name of new employee:",
            },
            {
                name: "role",
                type: "rawlist",
                message: "Select role of new employee:",
                choices: function () {
                    return roleData.map((role) => role.id + " " + role.title);
                },
            },
            {
                name: "manager",
                type: "rawlist",
                message: "Select manager of new employee:",
                choices: function () {
                    return employeeData.map(
                        (employee) =>
                            employee.manager_id +
                            " " +
                            employee.first_name +
                            " " +
                            employee.last_name
                    );
                },
            },
        ])
        .then(async (answer) => {
            let roleID;
            let managerID;
            try {
                for (let i = 0; i < roleData.length; i++) {
                    if (roleData[i].id == answer.role.slice(0, 1)) {
                        roleID = roleData[i].id;
                    }
                }
                for (let i = 0; i < employeeData.length; i++) {
                    if (employeeData[i].id == answer.manager.slice(0, 1)) {
                        managerID = employeeData[i].manager_id;
                    }
                }

                const query = `
        INSERT INTO employee_table (first_name, last_name, role_id, manager_id)
        VALUES (?, ?, ?, ?)`;
                const data = await db.query(query, [
                    answer.firstName,
                    answer.lastName,
                    roleID,
                    managerID,
                ]);
                console.log(
                    `${answer.firstName} ${answer.lastName} has been successfully added as an employee!`
                );
                init();
            } catch (err) {
                console.log(err);
            }
        });
};

const updateEE = async () => {
    const employeeQuery = "SELECT * FROM employee_table";
    const roleQuery = "SELECT * FROM role_table";
    let employeeData;
    let roleData;
    try {
        employeeData = await db.query(employeeQuery);
        roleData = await db.query(roleQuery);
    } catch (err) {
        console.log(err);
    }
    inquirer
        .prompt([
            {
                name: "employee",
                type: "rawlist",
                message: "Select employee to update role for:",
                choices: function () {
                    return employeeData.map(
                        (employee) =>
                            employee.id + " " + employee.first_name + " " + employee.last_name
                    );
                },
            },
            {
                name: "role",
                type: "rawlist",
                message: "Select role of new employee:",
                choices: function () {
                    return roleData.map((role) => role.id + " " + role.title);
                },
            },
        ])
        .then(async (answer) => {
            console.log(answer.employee.slice(0, 1));
            let employeeID;
            let roleID;
            console.log("answer", answer);
            try {
                for (let i = 0; i < employeeData.length; i++) {
                    if (employeeData[i].id == answer.employee.slice(0, 1)) {
                        employeeID = employeeData[i].id;
                        console.log("employeedata", employeeData);
                    }
                }
                for (let i = 0; i < roleData.length; i++) {
                    if (roleData[i].id == answer.role.slice(0, 1)) {
                        roleID = roleData[i].id;
                        console.log("roledata", roleData);
                    }
                }
                console.log(employeeID, roleID);
                const query = `UPDATE employee_table SET role_id = ? WHERE id = ?;`;
                const data = await db.query(query, [roleID, employeeID]);
                console.log(
                    `${answer.employee} successfully updated their role to ${answer.role}!`
                );
                init();
            } catch (err) {
                console.log(err);
            }
        });
};

init();
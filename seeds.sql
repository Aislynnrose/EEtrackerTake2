USE employee_db;

-- department_table seed
INSERT INTO department_table (id, department_name)
VALUES (1, "IT");
INSERT INTO department_table (id, department_name)
VALUES (2, "HR");
INSERT INTO department_table (id, department_name)
VALUES (3, "Marketing");
INSERT INTO department_table (id, department_name)
VALUES (4, "Accounting");
INSERT INTO department_table (id, department_name)
VALUES (5, "Customer Service");

-- role_table seed
INSERT INTO role_table (id, title, salary, department_id)
VALUES (1, "Controller", 160000, 2);
INSERT INTO role_table (id, title, salary, department_id)
VALUES (2, "Accountant", 65000, 4);
INSERT INTO role_table (id, title, salary, department_id)
VALUES (3, "Receptionist", 45000, 5);
INSERT INTO role_table (id, title, salary, department_id)
VALUES (4, "Social Media Specialist", 70000, 3);
INSERT INTO role_table (id, title, salary, department_id)
VALUES (5, "Software Engineer", 120000, 1);

-- employee_table seed
INSERT INTO employee_table (id, first_name, last_name, role_id, manager_id)
VALUES (1, "Mike", "Anderson", 1, 1);
INSERT INTO employee_table (id, first_name, last_name, role_id, manager_id)
VALUES (2, "Reed", "Wilson", 2, 2);
INSERT INTO employee_table (id, first_name, last_name, role_id, manager_id)
VALUES(3, "Allison", "Rose", 3, 3);
INSERT INTO employee_table (id, first_name, last_name, role_id, manager_id)
VALUES(4, "Kyle", "Smith", 4, NULL);
INSERT INTO employee_table (id, first_name, last_name, role_id, manager_id)
VALUES(5, "Jessica", "Moody", 5, NULL);
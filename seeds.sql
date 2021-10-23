USE employee_db;

-- department_table seed
INSERT INTO department_table (id, department_name)
VALUES (1, "IT"),
(2, "HR"),
(3, "Marketing"),
(4, "Accounting"),
(5, "Customer Service");

-- role_table seed
INSERT INTO role_table (id, title, salary, department_id)
VALUES (1, "Controller", 160000, 2),
(2, "Accountant", 65000, 4),
(3, "Receptionist", 45000, 5),
(4, "Social Media Specialist", 70000, 3),
(5, "Software Engineer", 120000, 1);

-- employee_table seed
INSERT INTO employee_table (id, first_name, last_name, role_id, manager_id)
VALUES (1, "Mike", "Anderson", 1, 1),
(2, "Reed", "Wilson", 2, 2),
(3, "Allison", "Rose", 3, 3),
(4, "Kyle", "Smith", 4, NULL),
(5, "Jessica", "Moody", 5, NULL);
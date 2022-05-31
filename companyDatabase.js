const express = require('express');
const mysql = require('mysql');
const parser = require('body-parser');
const { json } = require('express/lib/response');
const validator = require('validator');
const moment = require('moment');
const { reverseMultiplyAndSum } = require('validator/lib/util/algorithms');
const app = express();
app.use(parser.json());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

var connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "password",
    database: "Company",
    multipleStatements: true
})
connection.connect((err) => {
    if (err) {
        throw err;
    } else {
        console.log("Connected")
    }
})

// connection.query('CREATE TABLE Employees(first_name VARCHAR(10), last_name VARCHAR(10), date_of_joining DATE, dob DATE, department VARCHAR(25), email VARCHAR(255) PRIMARY KEY NOT NULL, password VARCHAR(10))', (err, rows) => {
//     if (err) {
//         throw err;
//     } else {
//         console.log("DATA SENT")
//         console.log(rows)
//     }
// })

// connection.query('INSERT INTO Employees(emp_id, first_name, last_name, date_of_joining , dob , department, email, passsword) VALUES(6,"Dhwani","Shah","2022-04-18", "2000-06-17", "NodeJS", "dhwam", "147258")', (err, rows) => {
// if (err) {
//             throw err;
//         } else {
//             console.log("DATA SENT")
//             console.log(rows)
//         }
//     })
const port = process.env.PORT || 2000;
app.listen(port);
console.log("App is listening to port 2000");

app.get('/employees', (req, res) => {
    connection.query('SELECT * FROM Employees', (err, rows, fields) => {
        if (!err) {
            console.log(rows);
            res.send(rows)
        } else {
            console.log(err);
        }
    })
})

app.get('/employees/:emp_id', (req, res) => {
    connection.query('SELECT * FROM Employees WHERE emp_id = ?', [req.params.emp_id], (err, rows, fields) => {
        if (!err) {
            console.log(rows);
            res.send(rows)
        } else {
            console.log(err);
        }
    })
})

app.delete('/employees/:emp_id', (req, res) => {
    connection.query('DELETE FROM Employees WHERE emp_id = ? ', [req.params.emp_id], (err, rows, fields) => {
        if (!err) {
            console.log(rows);
            res.send("Deleted Successfully")
        } else {
            console.log(err);
        }
    })
})

app.post('/employees', (req, res) => {
    let first_name = req.body.first_name;
    let last_name = req.body.last_name;
    let date_of_joining = req.body.date_of_joining;
    let dob = req.body.dob;
    let department = req.body.department;
    let email = req.body.email;
    let passsword = req.body.passsword;
    var date = moment(date_of_joining).utc().format('YYYY-MM-DD')
    let sql = 'INSERT INTO Employees( first_name, last_name, date_of_joining , dob , department, email, passsword) VALUES(?,?,?,?,?,?,?)'
    connection.query(sql, [first_name, last_name, date, dob, department, email, passsword], (err, rows, fields) => {
        if (!err) {
            //    console.log(rows);
            return res.status(200).json({ message: "Added" });
        } else {
            return res.status(500).json(err);
        }
    })
})


app.put('/employees/:emp_id', (req, res) => {
    const emp_id = req.params.emp_id;
    let first_name = req.body.first_name;
    let last_name = req.body.last_name;
    let date_of_joining = req.body.date_of_joining;
    let dob = req.body.dob;
    let department = req.body.department;
    let email = req.body.email;
    let passsword = req.body.passsword;
    let sql = 'UPDATE Employees SET first_name = ?, last_name = ?,  date_of_joining = ?, dob = ?, department = ?, email =?, passsword =? WHERE emp_id =?'
    connection.query(sql, [first_name, last_name, date_of_joining, dob, department, email, passsword, emp_id], (err, result, fields) => {
        if (!err) {
            if (result.affectedRows == 0) {
                return res.status(404).json({ message: "emp_id doesn,t exixts" });
            }
            return res.status(200).json({ message: "Updated Successfully" });
        } else {
            res.status(500).json(err);
        }
    });
});


//DEPARMENT

// connection.query('CREATE TABLE Department(name VARCHAR(25))', (err, rows) => {
//     if (err) {
//         throw err;
//     } else {
//         console.log("DATA SENT")
//         console.log(rows)
//     }
// })

// connection.query('INSERT INTO Department(name) VALUES("NodeJs")', (err, rows) => {
//     if (err) {
//                 throw err;
//             } else {
//                 console.log("DATA SENT")
//                 console.log(rows)
//             }
//         })

app.get('/department', (req, res) => {
    connection.query('SELECT * FROM Department', (err, rows, fields) => {
        if (!err) {
            console.log(rows);
            res.send(rows)
        } else {
            console.log(err);
        }
    })
})

app.get('/department/:name', (req, res) => {
    connection.query('SELECT * FROM Department WHERE name = ?', [req.params.name], (err, rows, fields) => {
        if (!err) {
            console.log(rows);
            res.send(rows)
        } else {
            console.log(err);
        }
    })
})


app.delete('/department/:name', (req, res) => {
    connection.query('DELETE FROM Department WHERE name = ? ', [req.params.name], (err, rows, fields) => {
        if (!err) {
            console.log(rows);
            res.send("Deleted Successfully")
        } else {
            console.log(err);
        }
    })
})

app.post('/department', (req, res) => {
    let name = req.body.name;
    var sql = "INSERT INTO Department(name) VALUES(?)"
    connection.query(sql, [name], (err, rows, fields) => {
        if (!err) {
            //    console.log(rows);
            return res.status(200).json({ message: "Added" });
        } else {
            return res.status(500).json(err);
        }
    })
})

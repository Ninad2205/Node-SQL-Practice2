const express = require('express');
const app = express();
const port = 4000;
const path = require("path");


// Get the client
const mysql = require('mysql2');
//get the faker
const { faker } = require('@faker-js/faker');

//using method override
const methodOverride = require("method-override");

app.use(methodOverride("_method"));
app.use(express.urlencoded({ extended: true }));


//specifing the views and public folder path
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));




app.get('/', (req, res) => {
    let q = "select count(*) from students";
    try {
        connection.query(q, (err, result) => {
            if (err) throw err;
            let count = result[0]['count(*)'];
            res.render("home.ejs", { count });
        });
    } catch (err) {
        console.log(err);
        res.send("some error in database");
    }

});

//to show users
app.get("/showAll", (req, res) => {
    let q = "select * from students";
    try {
        connection.query(q, (err, students) => {
            if (err) throw err;
            res.render("show.ejs", { students });
        });
    } catch (err) {
        console.log(err);
        res.send("some error occured in showAll route db");
    }

});

//Edit Student
app.get("/student/:id/edit", (req, res) => {
    let { id } = req.params;
    let q = `select * from students where id='${id}'`;
    try {
        connection.query(q, (err, result) => {
            if (err) throw err;
            // console.log(result[0]);
            let student = result[0];
            res.render("edit.ejs", { student });
        });
    } catch (err) {
        console.log(err);
        res.send("some error occured in edit route db");
    }

});

//updating info
app.patch("/student/:id", (req, res) => {
    let { id } = req.params;
    let { password: formpass, name: newname } = req.body;
    let q = `select * from students where id='${id}'`;
    try {
        connection.query(q, (err, result) => {
            if (err) throw err;
            let student = result[0];
            if (formpass != student.password)
            {
                res.send("WRONG PASSWORD!");
            }
            else
            {
                let q2 = `update students set name='${newname}' where id='${id}'`;
                connection.query(q2, (err, result) => {
                    if (err) throw err;
                    // res.send(result);
                    else {
                        res.redirect("/");
                    }

            });
        }
        });
    }catch(err){
        console.log(err);
        res.send("some error occured in show route db");
      }
});

//delete route
app.get("/student/:id/delete",(req,res)=>{
    let {id}=req.params;
    let q =`select * from students where id='${id}'`;
    try{
      connection.query(q,(err,result)=>{
        if(err) throw err;
        // console.log(result[0]);
        let student=result[0];
        res.render("delete.ejs",{student});
        
      });
    }catch(err){
      console.log(err);
      res.send("some error occured in show route db");
    }
    
  });

//delete in DB route
app.delete("/student/:id",(req,res)=>{
    let {id}=req.params;
    let{password:formpass}=req.body;
    let q =`SELECT * FROM students WHERE id='${id}'`;
    try{
      connection.query(q,(err,result)=>{
        if(err) throw err;
        // console.log(result[0]);
        let student=result[0];
        if(formpass != student.password)
        {
          res.send("WRONG PASSWORD!");
        }
        else
        {
          
          let q2 =`delete from students where id='${id}'`;
          connection.query(q2,(err,result)=>{
          if(err) throw err;   
          
          else{
            // res.send(result);
          res.redirect("/");
          }
          
        });
          
        }
      });
    }catch(err){
      console.log(err);
      res.send("some error occured in show route db");
    }
    
  });


//new student route
app.get("/newstudent",(req,res)=>{
  // res.send("New student");
  res.render("new.ejs");
});

app.post("/newstudent",(req,res)=>{
  let {id,branch,name,email,password}=req.body;
  // let id=faker.string.uuid();
  let q=`INSERT INTO students (id, name,branch, password, email) VALUES ('${id}','${name}','${branch}','${password}','${email}') `;
  try{
    connection.query(q,(err,result)=>{
      if(err){
        console.log(err.sqlMessage);
        return res.redirect("/error");
      }
      console.log("Added new student successfully...");
      res.redirect("/");
    });
  }catch(err){
    console.log(err);
    res.send("some error occured in db");
  }

})

//error route
app.get("/error",(req,res)=>{
  res.render("error.ejs");
});


app.listen(port, () => {
    console.log(`app listening on port ${port}!`);
});

// Create the connection to database
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    database: 'student',
    password: 'Ninad@8767046619',
});
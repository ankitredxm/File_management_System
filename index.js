const express=require('express');
const app=express();
const path=require('path');
const fs=require('fs');

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.set("view engine","ejs");

app.use(express.static(path.join(__dirname,'public')));

app.get("/",(req,res)=>{
    fs.readdir('./files',(err,files)=>{
        
        res.render("index",{files:files});
    })
});

app.post("/create",(req,res)=>{
    fs.writeFile(`./files/${req.body.title.split(' ').join('')}.txt`,req.body.details,(err)=>{
            res.redirect("/");
    })
    
});

app.post("/delete",(req,res)=>{
   
    fs.unlink(`./files/${req.body.filename}`,(err)=>{
        if(err){
            console.log(err);
            return res.send("error");
        }
        res.redirect("/");
    });
});

app.post("/read",(req,res)=>{
    fs.readFile(`./files/${req.body.filename}`,"utf-8",(err,data)=>{
        res.render("read",{data});
        // console.log(data);
    })
})

app.post("/edit",(req,res)=>{
    fs.readFile(`./files/${req.body.filename}`,"utf-8",(err,data)=>{
        res.render('edit',{
            filename:req.body.filename.replace('.txt',''),
            data
        })
    })
})


app.post("/update", (req, res) => {
    const oldName = req.body.oldf;
    const newName = req.body.new_title;


  console.log(oldName);

    fs.rename(
        `./files/${oldName}.txt`,
        `./files/${newName}.txt`,
        (err) => {

            if (err) {
                console.log(err);
                return res.redirect("/");
            }

            fs.writeFile(
                `./files/${newName}.txt`,
                req.body.details,
                (err) => {

                    if (err) console.log(err);
                    return res.redirect("/");
                }
            );
        }
    );
});

app.listen(3000);

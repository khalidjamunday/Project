const express=require("express");
const app =express();
const mongoose  = require("mongoose");
const listing = require("./models/listing");//../parent folder curr fold ka
const path = require("path");

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));//converts url enc data of form to js object(can be acc by req.body) wo this req.body undefined

const MONGO_URL="mongodb://127.0.0.1:27017/CozyNest";

async function main(){
    //connect method is async
    await mongoose.connect(MONGO_URL);
}

//calling main function
main()
    .then(()=>{
        console.log("connected to DB");
    })
    .catch((err)=>{
        console.log(err);
    });

app.get("/" , (req,res)=>{
    res.send("Root dir.");
    console.log("Root directory");
})

//INDEX ROUTE
app.get("/listings",async (req,res)=>{
    const alllistings = await listing.find({});
    res.render("listings/index",{alllistings});//see route /listing toh error
})

//NEW ROUTE
app.get("/listings/new",(req,res)=>{
    res.render("listings/new.ejs");
})//show route ke neeche toh usse :id samjh rha h

//SHOW ROUTE
app.get("/listings/:id",async(req,res)=>{
    let {id} = req.params;//....DETSTRUCTING
    const listings = await listing.findById(id);
    res.render("listings/show.ejs",{data : listings});//key value both same {listing}
})

//CREATE ROUTE
//data send kr rha hu to db async
app.post("/listings",async(req,res)=>{
    const newlisting = new listing(req.body.listing);
    await newlisting.save();
    res.redirect("/listings");
})

app.get("/testlisting",async (req,res)=>{
    let samplelisting = new listing({
        title: "New Villa",
        description: "By the beach",
        price: 1200,
        location: "Calangute,Goa",
        country: "India",
    });

    await samplelisting.save();//async o/w .save().then() as .save() async sh1......
    console.log("sample saved");
    res.send("successful testing");
})

app.listen(3000,()=>{
    console.log("server is listening on port 3000");
})

/*sh1....
use CozyNest
switched to db CozyNest
CozyNest> show collections
listings
CozyNest> db.listings.find()
[
  {
    _id: ObjectId('668a61b487eb4f9049141bab'),
    title: 'New Villa',
    description: 'By the beach',
    price: 1200,
    location: 'Calangute,Goa',
    country: 'India',
    __v: 0
  }
]*/







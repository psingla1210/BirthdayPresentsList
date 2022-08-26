const express = require("express");
const bodyParser = require("body-parser")
const ejs = require("ejs");
const mongoose = require("mongoose")

const app = express();
var gifts = [];
var giftsURL = [];

app.set("view engine", "ejs")
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect("mongodb+srv://prachi121:prachi1210@cluster0.dr4cg1e.mongodb.net/birthdaypresentslistDB", {useNewUrlParser: true});

// Create Schema
const presentsListSchema = new mongoose.Schema(
  {
    name: String,
    url: String,
    available: Boolean
  }
)

let port = process.env.PORT;
if(port == null || port == ""){
  port = 3000;
}

// Create Collection
const Present = mongoose.model("Present", presentsListSchema);

app.listen(port, function()
{
  console.log("Server started at port 3000");
});

app.get("/", function(req, res)
{
  var today = new Date();
  console.log("date is: " + today);
  var birthdayDate = new Date(today.getFullYear(), 9, 21);
  if(today.getMonth() == 9 && today.getDate() > 21)
  {
    birthdayDate.setFullYear(birthdayDate.getFullYear() + 1);
  }

  var one_day=1000*60*60*24;
  remainingDays = Math.ceil((birthdayDate.getTime()-today.getTime())/(one_day))

Present.find({}, function(err, foundgifts)
{
  // console.log(foundgifts)
  res.render("list", {remainingDays: remainingDays, gifts: foundgifts});
})

// console.log(gifts_new)

});

app.get("/:customBirthDate", function(req, res)
{
  console.log(req.params.customBirthDate);
});

app.post("/", function(req, res)
{
  var item = req.body.newItem;
  var itemURL = req.body.newItemURL;
  console.log(item);
  gifts.push(item);
  giftsURL.push(itemURL);

  const present = new Present(
    {
      name: item,
      url: itemURL,
      available: true
    }
  )
  present.save(function(err)
  {
    if(err){
      console.log(err);
    }
    else{
      console.log("Successfully added fruits");
    }
  })
  res.redirect("/");
})

app.post("/update", function(req, res)
{

  const itemId = req.body.checkbox;
  console.log(itemId);
  Present.findById(itemId, function(err, present)
{
  if(err){
    console.log(err);
  }
  else{
    Present.findByIdAndUpdate(itemId, { available:  !present.available}, function(err)
    {
      if(err){
        console.log(err);
      }
      else{
        console.log("Successfully updated item");
      }
    });
  }

})

  res.redirect("/");
})

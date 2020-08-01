const express = require("express");
const bodyParser = require("body-parser");
const cheerio = require("cheerio");
const request = require("request");
const firebase=require("firebase");
const app = express();
const port = process.env.PORT || 5000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

var config = {
  apiKey: "AIzaSyBdvu0gTl-OBfjIfsig6WMU0TkuHfV9kkk",
  authDomain: "webbereye.firebaseapp.com",
  databaseURL: "https://webbereye.firebaseio.com",
  projectId: "webbereye",
  storageBucket: "webbereye.appspot.com",
  messagingSenderId: "429758855894",
  appId: "1:429758855894:web:3a9c1f3600ec03ecc5a777",
  measurementId: "G-VWYR8C5RH6"
};
firebase.initializeApp(config);

// Get a reference to the database service
var database = firebase.database();
var timer=50;
var intervaa;


app.get("/api/hello", (req, res) => {
  res.send({ express: "Hello From Express" });
});

app.post("/api/getUrl", (req, res) => {
  console.log("2");
  request(req.body.webUrl, (error, response, body) => {
    console.log(error);
    console.log("1");
    res.send(cheerioCaller(error,response,req.body.webUrl,body));
  });
  console.log("3");
});

app.post("/api/refreshStocks", async (req, res) => {
  let list = req.body.itemList;
  let updatedList = [];
  let leno=list.length;
  await list.forEach((item) => {
    request(item.link, (error, response, body) => {
      updatedList.push(cheerioCaller(error,response,item.link,body));
      if(leno===updatedList.length){
        res.send(updatedList);
      }
    });
  });
});

app.post("/api/getAllItems", async (req, res) => {
  database.ref('/items/').once('value').then(function(snapshot) {
    var allItems = [];
    snapshot.forEach( (childSnapshot)=> {
      allItems = allItems.concat(childSnapshot.val());
    });
    res.send(allItems);
  });
});


app.post("/api/addItem", async (req, res) => {
  let list = req.body;
  res.send(writeItemData(list));
});

app.post("/api/deleteItem", async (req, res) => {
  let ID = req.body.ID;
  var updates = {};
      updates['items/' + ID] = null;
      return database.ref().update(updates);
});

writeItemData=(list)=> {
  try{
    var newSubkey = database.ref().child('items').push().key;
      var postItem = {
        id:newSubkey,
        name1:list.name1,
      name2:list.name2,
      itemNumber1:list.itemNumber1,
      itemNumber2:list.itemNumber2,
      price1:list.price1,
      price2:list.price2,
      link1:list.link1,
      link2:list.link2,
      currentDate:list.currentDate,
      img:list.img,
      oldStock:list.oldStock,
      inStock:list.inStock,
      };
      var updates = {};
      updates['items/' + newSubkey] = postItem;
      database.ref().update(updates);
      let y=[];
      y.push(postItem);
      return y;
  }catch(e){
    console.log(e.message);
  }
  
}

cheerioCaller=(error,response,link,body)=>{
  let x=link.split('.');
  let website=x[1];
  console.log(response);
  console.log(body);
  console.log(website);
  let itemDetails = {
    name: null,
    img: null,
    inStock: false,
    link: link,
    priceOnSams:null,
    itemNumber:null,
  };
  if (!error && response.statusCode === 200) {
    var $ = cheerio.load(body);
    $("div").each(function (i, element) {
      let a = $(this).attr("class");
      if(website==="samsclub"){
        if (a === "sc-cart-qty-button online ") {
          let isDisabled = $(this).find("button").attr("disabled");
          if (typeof isDisabled === "undefined") {
            itemDetails.inStock = true;
          } else {
            itemDetails.inStock = false;
          }
        }
        
        if (a === "sc-product-header-title-container") {
          itemDetails.name = $(this).contents().first().text();
        }
        if (a === "sc-image-viewer-valign-middle") {
          itemDetails.img = $(element).find("button").find("img").attr("src");
        }
        if (a === "sc-channel-price-price") {
          itemDetails.priceOnSams = $(element).find('span > span').attr("title").split(': ')[1];
        }
        if (a === "sc-product-header-item-number") {
          const x=$(this).contents().first().text().split(' ');
          itemDetails.itemNumber=x[2];
        }
      }else if(website==="costco"){
        // if (a === "sc-cart-qty-button online ") {
        //   let isDisabled = $(this).find("button").attr("disabled");
        //   if (typeof isDisabled === "undefined") {
        //     itemDetails.inStock = true;
        //   } else {
        //     itemDetails.inStock = false;
        //   }
        // }
        
        if (a === "product-h1-container-v2 visible-lg-block visible-xl-block") {
          console.log("in here");
          //itemDetails.name = $(element).find("h1").contents().first().text();
          const x = $(element).find("h1").contents().first().text();
          console.log(x);
        }
        // if (a === "RICHFXColorChange") {
        //   itemDetails.img = $(element).find("img").attr("src");
        // }
        // if (a === "your-price row no-gutter") {
        //   itemDetails.priceOnSams = $(element).find('div > span').attr("title");
        // }
        // if (a === "col-xs-12 col-lg-4 product-details-v2") {
        //   itemDetails.priceOnSams = $(element).find('div > span').attr("title");
        //   const x=$(this).contents().first().text().split(' ');
        //   itemDetails.itemNumber=x[2];
        // }
      }
      
      
    });
  }else{
    console.log("error");
  }
  return itemDetails;
}

runUpdate=()=>{
timer=5;
intervaa=setInterval(()=>{
  timer=timer-1;
  console.log(timer);
  if(timer===0){
    //callUpdate
    //clear interval
    //call function again;
    clearInterval(intervaa);
    console.log("Updating . . .");
    runUpdate();
  }
},1000);
}

app.listen(port, () => {
  //runUpdate();
  console.log(`Listening on port ${port}`);
});

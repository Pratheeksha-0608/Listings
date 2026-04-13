const mongoose=require("mongoose");
const initdata=require("./data.js");
const Listing=require("../models/listing.js");
main().then(()=>{
    console.log("Connection was successful");
})
.catch((err)=>{
    console.log(err);
});
async function main(){
await mongoose.connect("mongodb://127.0.0.1:27017/maindb");
}
const initDb=async ()=>{
    await Listing.deleteMany({});
    initdata.data=initdata.data.map((obj)=>({
        ...obj,owner:"69b35e6ae5f736ec50ff011c"
    }));
    await Listing.insertMany(initdata.data);
}
initDb();
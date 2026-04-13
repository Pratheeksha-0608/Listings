const express=require("express");
const router=express.Router();
const multer  = require('multer')
const {storage}=require("../cloudconfig.js");
const upload = multer({ storage })
const listing=require("../models/listing.js");
const wrapAsync=require('../utils/wrapAsync.js');
const {isloggedin,isowner,validatelisting}=require("../middleware.js");
const listingcontroller=require("../controllers/listing.js");
router.route("/")
.get(wrapAsync(listingcontroller.index))

.post(isloggedin,
     upload.single('image'),
     validatelisting,
     wrapAsync(listingcontroller.createlisting));
// New route
router.get('/new',
     isloggedin,
     listingcontroller.rendernewform);
router.get('/:_id',wrapAsync(listingcontroller.showlisting));
// Edit route
router.get('/:id/edit',
     isloggedin,
     isowner,
     wrapAsync(listingcontroller.rendereditform));

router.route("/:id")
// Update route
.put(isloggedin,isowner,
     upload.single('image'),
     validatelisting,
     wrapAsync(listingcontroller.updatelisting))
// Delete Route
.delete(isloggedin,isowner,wrapAsync(listingcontroller.destroylisting));  
module.exports=router;

Meteor.startup(function(){
	if (Images) {
    if (Images.find().count() == 0) {
      var numImages = 23;
      for (var i = 1; i < numImages; i++) {
        Images.insert({
          img_src: "img_" + i + ".jpg",
          img_alt: "Image number " + i
        });
      }
      console.log("startup.js: Inserted " + Images.find().count() + " images on the database");
    }
  }
});
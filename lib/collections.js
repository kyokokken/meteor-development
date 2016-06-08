Images = new Mongo.Collection("images");

// set up security on Images collection
Images.allow({
  insert: function(userId, doc) {
    console.log("Trying to insert an image from " + userId);
    if (Meteor.user()) {
      if (userId != createdBy) { // the user is messing around
        return false;
      } else {
        return true;
      }
    } else { // user not logged in
      return false;      
    }
  },
  remove: function(userId, doc) {
    return true;
  }
});
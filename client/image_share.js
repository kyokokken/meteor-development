Template.images.helpers({
  images: Images.find({}, {sort: {rating: -1, createdOn: -1}})
});

Template.images.events({
  'click .js-image' : function() {
    $(event.target).css("width", "50px");
  },

  'click .js-del-image' : function() {
    var image_id = this._id;
    $("#" + image_id).hide('slow', function(){
      Images.remove({"_id": image_id});
    });
  },

  'click .js-show-image-form' : function(event) {
    $("#image_add_form").modal('show');
  },

  'click .js-rate-image' : function(event) {
    var rating = $(event.currentTarget).data("userrating");
    var image_id = this.id;
    Images.update(
      {_id : image_id},
      {$set: {rating:rating}}
    );
  }
});

Template.image_add_form.events({
  'submit .js-add-image' : function(event) {
    var img_src, img_alt;
    img_src = event.target.img_src.value;
    img_alt = event.target.img_alt.value;
    Images.insert({
      img_src: img_src,
      img_alt: img_alt,
      createdOn: new Date()
    });
    $("#image_add_form").modal('hide');
    return false;
  }
});
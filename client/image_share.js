// Routing
Router.configure({
  layoutTemplate: 'ApplicationLayout'
});

Router.route('/', function () {
  this.render('welcome', {to: "main"});
});

Router.route('/images', function() {
  this.render('navbar', {to: "navbar"});
  this.render('images', {to: "main"});
});

Router.route('/image/:_id', function() {
  this.render('navbar', {to: "navbar"});
  this.render('image', {
    to: "main",
    data: function() {
      return Images.findOne({_id: this.params._id});
    }});
});

// Accounts config
Accounts.ui.config({
  passwordSignupFields: "USERNAME_AND_EMAIL"
});

// Infinite scrolling
Session.set("imageLimit", 8);
lastScrollTop = 0;
$(window).scroll(function(event){
  if ($(window).scrollTop()+ $(window).height() > $(document).height() - 100) {
    var scrollTop = $(this).scrollTop();
    if (scrollTop > lastScrollTop) {
      Session.set("imageLimit", Session.get("imageLimit") + 4);
    }
    lastScrollTop = scrollTop;
  }
});

Template.images.helpers({
  images: function() {
    if (Session.get("userFilter")) {
      return Images.find({createdBy: Session.get("userFilter")}, {sort: {rating: -1, createdOn: -1}});
    } else {
      return Images.find({}, {sort: {rating: -1, createdOn: -1}, limit: Session.get("imageLimit")});
    }
  },
  filtering_images: function() {
    if (Session.get("userFilter")) {
      return true;
    } else {
      return false;
    }
  },
  getFilterUser: function() {
    if (Session.get("userFilter")) {
      var user = Meteor.users.findOne({_id:Session.get("userFilter")});
      if (user) {
        return user.username;
      }
    }
  },
  getUser : function(user_id) {
    var user = Meteor.users.findOne({_id: user_id});
    if (user) {
      return user.username;
    } else {
      return "Anonymous";
    }
  }
});

Template.body.helpers({
  username: function() {
    if (Meteor.user()) {
      return Meteor.user().username;
    }
    else {
      return "Anonymous";
    }
  }
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
  },

  'click .js-set-image-filter' : function(event) {
    Session.set("userFilter", this.createdBy);
  },

  'click .js-unset-image-filter' : function(event) {
    Session.set("userFilter", undefined);
  }
});

Template.image_add_form.events({
  'submit .js-add-image' : function(event) {
    var img_src, img_alt;
    img_src = event.target.img_src.value;
    img_alt = event.target.img_alt.value;
    if (Meteor.user()) {
      Images.insert({
        img_src: img_src,
        img_alt: img_alt,
        createdOn: new Date(),
        createdBy: Meteor.user()._id
      });
    }
    $("#image_add_form").modal('hide');
    return false;
  }
});
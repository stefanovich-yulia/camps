var mongoose = require("mongoose");
var Campground = require("./models/campground");
var Comment = require("./models/comment");

var campData = [
  {
    name: "Capillano Bridge",
    image:"https://media.istockphoto.com/photos/a-view-from-above-from-the-suspension-bridge-on-rough-streams-of-a-picture-id908499042?k=6&m=908499042&s=612x612&w=0&h=D7Tj7o36nBDi5VlRd-6-_PGk9lNDskG-KDp1CJ9Ko70=",
    description:"Capilano Suspension Bridge crosses to towering evergreens, cedar-scented rainforest air and Treetops Adventure, 7 suspended footbridges offering views 110 feet above the forest floor. The new Cliffwalk follows a granite precipice along Capilano River with a labyrinth-like series of narrow cantilevered bridges, stairs and platforms and only 16 anchor points in the cliff supporting the structure!"
    //,
    // comments: [
    //   Comment.create( {
    //     author: "Marina",
    //     text: "It's fearfully, but excited"
    //   })
    // ]
  },
  {
    name:"Grouse Mountain",
    image:"https://res.cloudinary.com/simpleview/image/upload/c_limit,f_auto,q_65,w_845/v1/clients/vancouverbc/a-guide-to-grouse-mountain_930ab127-285b-4263-b2b2-7d8c8c250717.jpg",
    description:"Grouse Mountain is one of the North Shore Mountains of the Pacific Ranges in the District Municipality of North Vancouver, British Columbia, Canada. Exceeding 1,200 m (4,000 feet) in altitude at its peak, is the site of an alpine ski area, Grouse Mountain Resort, which overlooks Greater Vancouver with four chairlifts servicing 26 runs."
    //,
    // comments: [
    //   {
    //     author: "Marina",
    //     text: "Good workout ;)"
    //   },
    //   {
    //     author: "Colt",
    //     text: "I love this place!"
    //   }
    // ]
  },
  {
    name:"Garbaldi Lake",
    image:"https://www.aliveandwellfitness.ca/wp-content/uploads/2014/08/Camping-at-Black-Tusk-Garibaldi-Lake1.jpg?x30177",
    description:"Garibaldi Lake in Garibaldi Provincial Park is a stunning, glacier-fed lake that sits 1,450 m high, surrounded by snow-capped mountains, glaciers, alpine meadows and volcanic structures. It is a great day hike, and even better camping destination."
    //,
    // comments: [
    //   {
    //     author: "Marina",
    //     text: "Incredible cold beauty"
    //   }
    //]
  }
];


function init() {
  Campground.remove({}, function(err) {
    if (err)
    {
      console.log(err);
      return;
    }
    console.log("Campgrounds removed!");
    addDefaultData();
  });
}

function addDefaultData() {
  campData.forEach(function(seed) {
    Campground.create(seed, function(err, campground) {
      if (err) console.log(err);
      else
      {
        console.log("Object succesfully added!");
        Comment.create(
          {
            text: "Incredible place!",
            author: "Igor"
          }, function(err, comment) {
            if (err) console.log(err);
            else
            {
              console.log("Comment added");
              campground.comments.push(comment);
              campground.save();
            }
          }
        )

      }
    })
  });
}

module.exports.init = init;

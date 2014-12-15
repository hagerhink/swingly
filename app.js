/*global require, module, console, __dirname, process*/
var express = require('express');
var hbs = require('express-hbs');
var app = express();
var path = require('path');
var fs = require('fs');
Swag = require('swag');

//TODO: Add to config file?
var projectSpecificData = {
  showCoolThings: true,
  coolItems: [{
    heading: 'A cool list item',
    subtitle: 'With some cool text'
  },
  {
    heading: 'Another cool list item',
    subtitle: 'Also with cool text'
  },
  {
    heading: 'A not quite as cool list item',
    subtitle: 'With super boring text'
  },
  {
    heading: 'A neutral list item',
    subtitle: 'With some pretty okay text'
  }]
}

app.engine('hbs', hbs.express3({
  partialsDir: __dirname + '/views'
}));

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(path.join(__dirname, 'public')));

//Register handlebar helpers
hbs.registerHelper('times', function(n, block) {
  var accum = '';
  for(var i = 0; i < n; ++i)
    accum += block.fn(i);
  return accum;
});
Swag.registerHelpers(hbs);

//Create components from markup in commments in CSS
//TODO: Add to build step
fs.readFile(__dirname + '/public/css/screen.css', 'utf8', function (err,data) {
  if (err) {
    return console.log(err);
  }

  //Get all components in scss-comments
  var newTxt = data.split('/*');
  var comments = [];
  for (var i = 1; i < newTxt.length; i++) {
      comments.push(newTxt[i].split('*/')[0]);
  }

  var names = [];

  //This is very best code to get the names of the components. 5/5 Thorvalds.
  for (var i = 0; i < comments.length; i++) {
      var tempName = comments[i].split('class="');
      names.push(tempName[1].split(' component">')[0]);
  }

  //Create components as .hbs-templates in /components
  if(names.length === comments.length){
  comments.forEach(function(comment, index){
    fs.writeFile(__dirname + '/components/'+ names[index]+'.hbs', comment, function(err) {
      if(err) {
          //TODO: Proper error handling
          console.log(err);
      } else {
          console.log("Created " + names[index] + " component");
      }
    }); 
  });
  }
});

//Register all components as partials and add partials to component list
//TODO: Refactor and add to build step
var partialsDir = __dirname + '/components';
var filenames = fs.readdirSync(partialsDir);
var allComponentsPartialMarkup = '';

filenames.forEach(function (filename) {
  var matches = /^([^.]+).hbs$/.exec(filename);
  if (!matches) {
    return;
  }
  var name = matches[1];
  var template = fs.readFileSync(partialsDir + '/' + filename, 'utf8');
  
  //add prepare component to be added to component list in styleguide
  //TODO: Refactor
  if(filename !== 'componentlist.hbs') {
 	allComponentsPartialMarkup = allComponentsPartialMarkup + '<a href="/styleguide/'+ filename.replace('.hbs', '') +'"><h3 class="styleguide-h3">'+ filename.replace('.hbs', '') +'</h3></a>\n<div class="component-list-item">{{> ' + filename.replace('.hbs', '') +'}}</div>\n';
  	console.log(filename + ' added to component list in styleguide');
  }
  hbs.registerPartial(name, template);
});

//Generates very crude component-list in the styleguide from components
fs.writeFile(__dirname + '/components/componentlist.hbs', allComponentsPartialMarkup, function(err) {
    if(err) {
        console.log(err);
    } else {
        console.log("Component list generated");
    }
}); 

// ROUTES
app.get('/', function(req, res){
  res.render('index', projectSpecificData);
});

//Register all views in view as route
app.get('/views/:view', function(req, res) {
  var viewTitle = req.params.view;

  fs.readFile(__dirname + '/views/' + req.params.view + '/' + req.params.view + '.json','utf-8', function(err, data) {
    //Get view specific data from view folder
    viewSpecificData = JSON.parse(data);
    allData = mergeObjects(projectSpecificData, viewSpecificData);
    if(!err) {
      res.render(req.params.view + '/' + req.params.view, allData);
    }
    else {
      //Add error page
    }
  });
});

app.get('/styleguide', function(req, res){
  res.render('styleguide/index', projectSpecificData);
});

app.get('/styleguide/:component', function(req, res){
  res.render('styleguide/component-detail', {
    componentName: req.params.component
  });
});


var port = Number(process.env.PORT || 3000);
app.listen(port, function() {
  console.log("Listening  http://127.0.0.1:" + port);
});

/**
 * Overwrites obj1's values with obj2's and adds obj2's if non existent in obj1
 * @param obj1
 * @param obj2
 * @returns obj3 a new object based on obj1 and obj2
 */
function mergeObjects(obj1,obj2){
    var obj3 = {};
    for (var attrname in obj1) { obj3[attrname] = obj1[attrname]; }
    for (var attrname in obj2) { obj3[attrname] = obj2[attrname]; }
    return obj3;
}

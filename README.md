# Swingly
A wireframing/prototype workflow with reusable components and automated styleguide generation. Currently, it is very much a hack. The main idea is to enable a developer to quickly make prototypes with reusable components using express, handlebars (with swag) and scss. The markup and the styling are both mainly defined in the css (markup in comments of the css) in order to keep everything more tightly coupled. Javascript functionality is a second-class citizen using this workflow/tool. The main focus should be on solving responsive behavoir, layout and user flows.

# Usage
After compiling css, restart server ... two times ... to generate components (saving app.js restarts server). This _clearly_ needs to be improved/handled in build step. The generated styleguide can be found under /styleguide.

Pressing 'G' toggles grayscale, 'C' adds borders to components.

# Setup
You'll need node and ruby (for Compass, Scss):
     
```sh
gem install bundler                # http://gembundler.com/
bundle install                     # Dev dependencies in Gemfile
npm install                        # Dev dependencies in package.json
```  

# Compile
Watch for changes, compile Javascript and SCSS, and run server
  
```sh
grunt
```

# Exporting wireframes
Could be done easily with Pageres (functionality for this will be added to this project later)
https://www.npmjs.org/package/pageres

# TODO:
* Change to gulp instead of Grunt
* Add better build step
* Add some kind of state handling for components
* Make everything more robust
* Refactor all the codes
* Add bootstrap 
* Add fontawesome
* Add placeholder images
* Add possibility to use other template engines and css precompilers
* Add better examples, more components and use cases

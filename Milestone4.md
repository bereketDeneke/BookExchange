
## Sass Configuration
 line-number: 
 package.json:10 
 package.json:11
 + steps to start automathic compilation use:
   >  npm run watch:sass

- **Source Directory**: `styles/`
- **Sass style files under styles directory**
    offer.module.scss
    global.scss
    bookDetailModal.module.scss
    Profile.module.scss
    MyRequests.module.scss
    IncomingRequests.module.scss
  
 
## Build Tool Configuration
- **Vite Configuration**: [`vite.config.js`](vite.config.js)
  - Integrated ESLint and Sass compilation.
- **ESLint Configuration**: [`.eslintrc.json`](.eslintrc.json)
  - Rules for linting JavaScript and Vue files.
- **Sass Directory**: [`src/styles`](src/styles)
  - Contains unprocessed `.scss` files.
- **Lint Script**: `"lint": "eslint --ext .js,.vue src/"`
  - Runs ESLint on the entire codebase automatically on file change.


## Cypress
npx cypress run


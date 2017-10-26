<p align="center"><img src="app/assets/assets/img/logo.png" height="100"/></p>
<h1 align="center"><a href="https://captainfact.io">CaptainFact.io</a></h1>
<br/>

Master: [![Build Status](https://travis-ci.org/CaptainFact/captain-fact-frontend.svg?branch=travis-configuration)](https://travis-ci.org/CaptainFact/captain-fact-frontend) &nbsp;&nbsp;
Staging: [![Build Status](https://travis-ci.org/CaptainFact/captain-fact-frontend.svg?branch=staging)](https://travis-ci.org/CaptainFact/captain-fact-frontend)

## Getting started

This is a HTML5 application, built with [Brunch](http://brunch.io).

* Install (if you don't have them):
    * [Node.js](http://nodejs.org)
    * [Brunch](http://brunch.io): `npm install -g brunch`
    * Brunch plugins and app dependencies: `npm install`
* Run:
    * `npm start` — watches the project with continuous rebuild. This will also launch HTTP server with [pushState](https://developer.mozilla.org/en-US/docs/Web/Guide/API/DOM/Manipulating_the_browser_history).
    * `npm run build` — builds minified project for production
* Learn:
    * `public/` dir is fully auto-generated and served by HTTP server.  Write your code in `app/` dir.
    * Place static files you want to be copied from `app/assets/` to `public/`.

## Main Libraries / Frameworks

- ES6 with Babel
- ReactJS: vue layer
- Redux: state management
- ReactRouter: routing
- phoenix: interaction with phoenix socket
- Bulma: base styles

## Conventions

```
app
├── API => Api libraries for both REST API and websockets
├── assets => static assets, directly copied to the public directory
├── components => React components
├── lib => Misc utilities
├── state => All redux related
│   ├── comments
│   │   ├── effects.js => Async actions creators, always return a promise
│   │   ├── record.js => The object representing a single comment
│   │   ├── reducer.js => Reducer + actions creators, always return an action object
│   │   └── selectors.js => re-select selectors to select data in state
│   └── ...
├── styles => stylesheet in .sass format, all included from application.sass
├── i18n.js => I18n initialization
└── router.jsx => Application router and main entry point
```

### Effects

An effect is an async action that may dispatch one or more actions when called. It always returns a
promise, ideally without the need for .catch(...) - errors should be converted to FSA errors objects.


## License

GNU General Public License v3.0

Permissions of this strong copyleft license are conditioned on making available complete source code of licensed works and modifications, which include larger works using a licensed work, under the same license. Copyright and license notices must be preserved. Contributors provide an express grant of patent rights.

See [LICENSE](LICENSE) for more info.
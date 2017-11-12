<p align="center"><img src="app/assets/assets/img/logo.png" height="100"/></p>
<h1 align="center"><a href="https://captainfact.io">CaptainFact.io</a></h1>
<p align="center"><a href="https://gitter.im/CaptainFact"><img src="https://badges.gitter.im/Join%20Chat.svg" alt="Join the chat at https://gitter.im/CaptainFact"/></a></p>
<p align="center">Master: <a href="https://travis-ci.org/CaptainFact/captain-fact-frontend"><img src="https://travis-ci.org/CaptainFact/captain-fact-frontend.svg?branch=travis-configuration" alt="Build Status" /></a> &nbsp;&nbsp;
Staging: <a href="https://travis-ci.org/CaptainFact/captain-fact-frontend"><img src="https://travis-ci.org/CaptainFact/captain-fact-frontend.svg?branch=staging" alt="Build Status" /></a></p>
<br/>

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
- Bulma: base styles (we're still using an old 0.3.2 version, documentation
[here (Github)](https://github.com/jgthms/bulma/tree/0395dc59d8b147f2f47d057a6ffde2eb2966db49/docs/documentation))
or [here (archive.org)](https://web.archive.org/web/20170518075321/http://bulma.io/documentation/overview/start/)

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

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md)

## Linked projects

* [Extension](https://github.com/CaptainFact/captain-fact-extension)

## License

GNU AFFERO GENERAL PUBLIC LICENSE Version 3

Permissions of this strongest copyleft license are conditioned on making available complete source code of licensed works and modifications, which include larger works using a licensed work, under the same license. Copyright and license notices must be preserved. Contributors provide an express grant of patent rights. When a modified version is used to provide a service over a network, the complete source code of the modified version must be made available.

See [LICENSE](LICENSE) for more info.
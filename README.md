<p align="center"><img src="app/assets/assets/img/logo.png" height="100"/></p>
<h1 align="center"><a href="https://captainfact.io">CaptainFact.io</a></h1>
<p align="center"><a href="https://discord.gg/2Qd7hMz" title="Discord"><img src="https://discordapp.com/api/guilds/416782744748687361/widget.png" alt="Discord"></a>
<a href="https://twitter.com/CaptainFact_io" title="Twitter"><img src="https://img.shields.io/twitter/follow/CaptainFact_io.svg?style=social&label=Follow"></a>
<a href="./LICENSE"><img src="https://img.shields.io/github/license/CaptainFact/captain-fact-frontend.svg" alt="AGPL3"></a></p>
<hr/>
<p align="center">Master: <a href="https://travis-ci.org/CaptainFact/captain-fact-frontend"><img src="https://travis-ci.org/CaptainFact/captain-fact-frontend.svg?branch=travis-configuration" alt="Build Status" /></a> &nbsp;&nbsp;
Staging: <a href="https://travis-ci.org/CaptainFact/captain-fact-frontend"><img src="https://travis-ci.org/CaptainFact/captain-fact-frontend.svg?branch=staging" alt="Build Status" /></a></p>
<hr/><br/>

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

#### File structure

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
├── i18n => I18n initialization + translation files
└── router.jsx => Application router and main entry point
```

#### Exporting components

Components files should export two versions :

1. `export DumbMyComponent` : non-connected component (for testing)
2. `export default MyComponent` : connected component

Non-connected components exports are there for testing them without the need
to be connected to a store. If component is always dumb, you can export
`default` only.

You might find some exceptions in old components but all new
ones must follow this rule. 

### Effects

An effect is an async action that may dispatch one or more actions when called. It always returns a
promise, ideally without the need for .catch(...) - errors should be converted to FSA errors objects.

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md)

## Linked projects

* [Extension](https://github.com/CaptainFact/captain-fact-extension)
* [Overlay injector](https://github.com/CaptainFact/captain-fact-overlay-injector)

## Dependencies 

Many thanks to [adorable.io](http://avatars.adorable.io/) for their great consistent avatar service (the funny faces
you see if you don't set your own profile picture).

## License

GNU AFFERO GENERAL PUBLIC LICENSE Version 3

Permissions of this strongest copyleft license are conditioned on making available complete source code of licensed works and modifications, which include larger works using a licensed work, under the same license. Copyright and license notices must be preserved. Contributors provide an express grant of patent rights. When a modified version is used to provide a service over a network, the complete source code of the modified version must be made available.

See [LICENSE](LICENSE) for more info.

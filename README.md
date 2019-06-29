<p align="center"><img src="app/static/assets/img/logo.png" height="100"/></p>
<h1 align="center"><a href="https://captainfact.io">CaptainFact.io</a></h1>
<p align="center"><a href="https://discord.gg/2Qd7hMz" title="Discord"><img src="https://discordapp.com/api/guilds/416782744748687361/widget.png" alt="Discord"></a>
<a href="https://twitter.com/CaptainFact_io" title="Twitter"><img src="https://img.shields.io/twitter/follow/CaptainFact_io.svg?style=social&label=Follow"></a>
<a href="https://opencollective.com/captainfact_io" title="Backers on Open Collective"><img src="https://opencollective.com/captainfact_io/backers/badge.svg"></a>
<a href="./LICENSE"><img src="https://img.shields.io/github/license/CaptainFact/captain-fact-frontend.svg" alt="AGPL3"></a>
<a href="https://travis-ci.org/CaptainFact/captain-fact-frontend"><img src="https://travis-ci.org/CaptainFact/captain-fact-frontend.svg?branch=travis-configuration" alt="Build Status" /></a>
</p>
<hr/>
<p align="center">
<a href="https://opencollective.com/captainfact_io/donate" target="_blank">
  <img src="https://opencollective.com/captainfact_io/donate/button@2x.png?color=white" width=300 />
</a>
</p>
<hr/>

## Getting started

If you're already have the API running locally, a simple `npm install && npm start`
should be enough. Otherwise follow the procedure below:

- Install (if you don't have them):

  - [Docker](https://docs.docker.com/install/)
    and [docker-compose](https://docs.docker.com/compose/install/)
    (to start the API easily)
  - NodeJS, ideally using [asdf-vm](https://github.com/asdf-vm/asdf) with `NODEJS_CHECK_SIGNATURES=no asdf install`
  - App dependencies: `npm install`

- Run:
  - `docker-compose up` - Start the API
  - `npm start` - Start the front-end
  - `npm run test` - Runs all unit tests

Front-end is started on http://localhost:3333

A default account should have been created for you with
e-mail=`admin@captainfact.io` and password=`password`.

## Conventions

#### File structure

```
app
├── API => API libraries for both REST API and websockets
├── assets => Assets imported from JS
├── components => All react components
├── i18n => Translations
├── lib => Misc utilities
├── state => All redux related
│   ├── comments
│   │   ├── effects.js => Async actions creators, always return a promise
│   │   ├── record.js => The object representing a single comment
│   │   ├── reducer.js => Reducer + actions creators, always return an action object
│   │   └── selectors.js => Re-select selectors to select data in state
│   └── ...
├── static => Static assets, directly copied to the public directory
├── styles => Stylesheets in .sass format, all included from application.sass
└── router.jsx => Application router and main entry point
```

#### Styling

Styling is based on [Bulma](https://bulma.io/documentation/) and was initially
customized with SASS. However we now include [styled-components](https://github.com/emotion-js/emotion), [styled-system](https://github.com/jxnblk/styled-system) and [@rebass/grid](https://github.com/rebassjs/grid).
This has become the prefered way to build new components.

#### Icons

We bundle a custom font icon built with [IcoMoon](https://icomoon.io/). You can find scripts and config
for this in `dev/` but the preferred (and easiest) way to add new icons today
is to use `https://styled-icons.js.org/`.

## Main Libraries / Frameworks

- [ES6](http://es6-features.org) with [Babel](https://babeljs.io/)
- [React](https://reactjs.org/): View layer
- [Redux](https://redux.js.org/): State management
- [React Router](https://github.com/ReactTraining/react-router): Routing
- [Phoenix](https://phoenixframework.org/): Interaction with [https://hexdocs.pm/phoenix/Phoenix.Socket.html]Phoenix.Socket)
- [Bulma](https://bulma.io/): Base styles

## Linked projects

- [Community discussions and documentation](https://github.com/CaptainFact/captain-fact/)
- [API](https://github.com/CaptainFact/captain-fact-api)
- [Extension](https://github.com/CaptainFact/captain-fact-extension)
- [Overlay injector](https://github.com/CaptainFact/captain-fact-overlay-injector)

## License

GNU AFFERO GENERAL PUBLIC LICENSE Version 3

Permissions of this strongest copyleft license are conditioned on making available complete source code of licensed works and modifications, which include larger works using a licensed work, under the same license. Copyright and license notices must be preserved. Contributors provide an express grant of patent rights. When a modified version is used to provide a service over a network, the complete source code of the modified version must be made available.

See [LICENSE](LICENSE) for more info.

// Import polyfills
import "core-js/es6/promise.js"
import "core-js/es6/symbol.js"
import "core-js/es6/array.js"
import "core-js/es6/string.js"
import "core-js/es7/array.js"
import "core-js/es7/object.js"
import "core-js/modules/es6.math.trunc.js"

import { polyfill as smoothSrollPolyfill } from 'smoothscroll-polyfill'
smoothSrollPolyfill()

// Import libs
import React from "react"
import ReactDOM from "react-dom"
import { Router, Route, IndexRoute, browserHistory } from "react-router"
import { Provider } from "react-redux"

// Load store
import store from "./state"

// Import Views
import { default as App } from "./components/App"
import { Home, NotFound, BrowserExtensionsPage } from "./components/Pages"
import { PublicVideos, AddVideoForm } from "./components/Videos"
import { VideoDebate } from "./components/VideoDebate"
import Help from './components/Help/Help'
import UserProfile from './components/Users/UserProfile'
import ThirdPartyCallback from './components/Users/ThirdPartyCallback'
import UserSettings from './components/Users/UserSettings'
import LoginForm from './components/Users/LoginForm'
import SignupForm from './components/Users/SignupForm'
import User from './components/Users/User'
import ResetPasswordRequestForm from './components/Users/ResetPasswordRequestForm'
import ResetPasswordConfirmForm from './components/Users/ResetPasswordConfirmForm'
import ConfirmEmail from './components/Users/ConfirmEmail'
import Moderation from './components/Moderation'
import { SpeakerPage } from './components/Speakers/SpeakerPage'
import NewsletterSubscription from './components/Users/NewsletterSubscription'


ReactDOM.render(
  <Provider store={store}>
    <Router history={browserHistory}>
      <Route path="/" component={App}>
        <IndexRoute component={Home} />
        <Route path="/signup" component={SignupForm}/>
        <Route path="/signup/callback/:provider" component={ThirdPartyCallback}/>
        <Route path="/login" component={LoginForm}/>
        <Route path="/login/callback/:provider" component={ThirdPartyCallback}/>
        <Route path="/confirm_email/:token" component={ConfirmEmail}/>
        <Route path="/reset_password" component={ResetPasswordRequestForm}/>
        <Route path="/reset_password/confirm/:token" component={ResetPasswordConfirmForm}/>
        <Route path="/newsletter/unsubscribe/:token" component={NewsletterSubscription}/>
        <Route path="/u/:username" component={User}>
          <IndexRoute component={UserProfile}/>
          <Route path="/u/:username/activity" component={NotFound}/>
          <Route path="/u/:username/settings" component={UserSettings}/>
          <Route path="/u/:username/bookmarks" component={NotFound}/>
        </Route>
        <Route path="/videos" component={PublicVideos}/>
        <Route path="/videos/add" component={AddVideoForm}/>
        <Route path="/videos/add/:videoUrl" component={AddVideoForm}/>
        <Route path="/videos/:videoId" component={VideoDebate} view="debate"/>
        <Route path="/videos/:videoId/history" component={VideoDebate} view="history"/>
        <Route path="/s/:slug_or_id" component={SpeakerPage}/>
        <Route path="/help" component={Help}/>
        <Route path="/help/*" component={Help}/>
        <Route path="/extension" component={BrowserExtensionsPage}/>
        <Route path="/moderation" component={Moderation}/>
        <Route path="*" component={NotFound}/>
      </Route>
    </Router>
  </Provider>,
  document.getElementById("app")
)

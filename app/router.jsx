// Import libs
import React, { Suspense, lazy } from "react"
import { Router, Route, IndexRoute, browserHistory } from "react-router"

// Import Views
import App from "./components/App"
import Home from "./components/Home/Home"
import { NotFound, BrowserExtensionsPage } from "./components/Pages"
import { AddVideoForm } from "./components/Videos"
import VideosIndexPage from "./components/Videos/VideosIndexPage"
import { VideoDebate } from "./components/VideoDebate"
import Help from "./components/Help/Help"
import UserProfile from "./components/Users/UserProfile"
import ThirdPartyCallback from "./components/Users/ThirdPartyCallback"
import UserSettings from "./components/Users/UserSettings"
import LoginForm from "./components/Users/LoginForm"
import SignupForm from "./components/Users/SignupForm"
import User from "./components/Users/User"
import ResetPasswordRequestForm from "./components/Users/ResetPasswordRequestForm"
import ResetPasswordConfirmForm from "./components/Users/ResetPasswordConfirmForm"
import ConfirmEmail from "./components/Users/ConfirmEmail"
import Moderation from "./components/Moderation/Moderation"
import { SpeakerPage } from "./components/Speakers/SpeakerPage"
import NewsletterSubscription from "./components/Users/NewsletterSubscription"
import ActivityLog from "./components/Users/ActivityLog"

import City from "./views/City"

const CFRouter = () => (
  <Router history={browserHistory}>
    <Route path="/city" component={City} />
    <Route path="/" component={App}>
      <IndexRoute component={Home} />
      <Route path="/signup" component={SignupForm} />
      <Route path="/signup/callback/:provider" component={ThirdPartyCallback} />
      <Route path="/login" component={LoginForm} />
      <Route path="/login/callback/:provider" component={ThirdPartyCallback} />
      <Route path="/confirm_email/:token" component={ConfirmEmail} />
      <Route path="/reset_password" component={ResetPasswordRequestForm} />
      <Route path="/reset_password/confirm/:token" component={ResetPasswordConfirmForm} />
      <Route path="/newsletter/unsubscribe/:token" component={NewsletterSubscription} />
      <Route path="/u/:username" component={User}>
        <IndexRoute component={UserProfile} />
        <Route path="/u/:username/activity" component={ActivityLog} />
        <Route path="/u/:username/settings" component={UserSettings} />
      </Route>
      <Route path="/videos" component={VideosIndexPage} />
      <Route path="/videos/add" component={AddVideoForm} />
      <Route path="/videos/add/:videoUrl" component={AddVideoForm} />
      <Route path="/videos/:videoId" component={VideoDebate} view="debate" />
      <Route path="/videos/:videoId/history" component={VideoDebate} view="history" />
      <Route path="/s/:slug_or_id" component={SpeakerPage} />
      <Route path="/help" component={Help} />
      <Route path="/help/*" component={Help} />
      <Route path="/extension" component={BrowserExtensionsPage} />
      <Route path="/moderation" component={Moderation} />
      <Route path="*" component={NotFound} />
    </Route>
  </Router>
)

export default CFRouter

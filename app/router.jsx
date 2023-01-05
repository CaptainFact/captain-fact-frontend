// Import libs
import React from 'react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import { createBrowserHistory } from 'history'

// Import Views
import Layout from './components/App/Layout'
import Home from './components/Home/Home'
import { NotFound, BrowserExtensionsPage } from './components/Pages'
import { AddVideoForm } from './components/Videos'
import VideosIndexPage from './components/Videos/VideosIndexPage'
import { VideoDebate } from './components/VideoDebate'
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
import Moderation from './components/Moderation/Moderation'
import { SpeakerPage } from './components/Speakers/SpeakerPage'
import NewsletterSubscription from './components/Users/NewsletterSubscription'
import ActivityLog from './components/Users/ActivityLog'
import UserAddedVideos from './components/Videos/UserAddedVideos'
import NotificationsPage from './components/LoggedInUser/NotificationsPage'
import SubscriptionsPage from './components/LoggedInUser/SubscriptionsPage'
import LogoutPage from './components/LoggedInUser/LogoutPage'
import SupportUs from './components/SupportUs'
import SearchPage from './components/Search/SearchPage'

const CFRouter = () => (
  <Router history={createBrowserHistory}>
    <Layout>
      <Switch>
        <Route path="/" exact component={Home} />
        <Route path="/signup" exact component={SignupForm} />
        <Route path="/signup/callback/:provider" exact component={ThirdPartyCallback} />
        <Route path="/login" exact component={LoginForm} />
        <Route path="/logout" exact component={LogoutPage} />
        <Route path="/login/callback/:provider" exact component={ThirdPartyCallback} />
        <Route path="/confirm_email/:token" exact component={ConfirmEmail} />
        <Route path="/reset_password" exact component={ResetPasswordRequestForm} />
        <Route path="/reset_password/confirm/:token" exact component={ResetPasswordConfirmForm} />
        <Route path="/newsletter/unsubscribe/:token" exact component={NewsletterSubscription} />
        <Route path="/u/:username">
          <User>
            <Switch>
              <Route path="/u/:username" exact component={ActivityLog} />
              <Route path="/u/:username/profile" exact component={UserProfile} />
              <Route path="/u/:username/settings" exact component={UserSettings} />
              <Route path="/u/:username/videos" exact component={UserAddedVideos} />
              <Route path="/u/:username/subscriptions" exact component={SubscriptionsPage} />
              <Route path="/u/:username/notifications" exact component={NotificationsPage} />
            </Switch>
          </User>
        </Route>
        <Route path="/videos" exact component={VideosIndexPage} />
        <Route path="/videos/add" exact component={AddVideoForm} />
        <Route path="/videos/add/:videoUrl" exact component={AddVideoForm} />
        <Route path="/videos/:videoId/:view(history|debate)?" exact component={VideoDebate} />
        <Route path="/s/:slug_or_id" exact component={SpeakerPage} />
        <Route path="/help/:splat?" component={Help} />
        <Route path="/extension" exact component={BrowserExtensionsPage} />
        <Route path="/moderation" exact component={Moderation} />
        <Route path="/support-us" exact component={SupportUs} />
        <Route path="/search/:entity(videos|statements|speakers)?" component={SearchPage} />
        <Route path="*" component={NotFound} />
      </Switch>
    </Layout>
  </Router>
)

export default CFRouter

// Import libs
import React from 'react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'

// Import Views
import Layout from './components/App/Layout'
import Help from './components/Help/Help'
import Home from './components/Home/Home'
import LogoutPage from './components/LoggedInUser/LogoutPage'
import NotificationsPage from './components/LoggedInUser/NotificationsPage'
import SubscriptionsPage from './components/LoggedInUser/SubscriptionsPage'
import Moderation from './components/Moderation/Moderation'
import { BrowserExtensionsPage, NotFound } from './components/Pages'
import SearchPage from './components/Search/SearchPage'
import { SpeakerPage } from './components/Speakers/SpeakerPage'
import SupportUs from './components/SupportUs'
import ActivityLog from './components/Users/ActivityLog'
import ConfirmEmail from './components/Users/ConfirmEmail'
import LoginForm from './components/Users/LoginForm'
import NewsletterSubscription from './components/Users/NewsletterSubscription'
import ResetPasswordConfirmForm from './components/Users/ResetPasswordConfirmForm'
import ResetPasswordRequestForm from './components/Users/ResetPasswordRequestForm'
import SignupForm from './components/Users/SignupForm'
import User from './components/Users/User'
import UserProfile from './components/Users/UserProfile'
import UserSettings from './components/Users/UserSettings'
import { VideoDebate } from './components/VideoDebate'
import { AddVideoForm } from './components/Videos'
import UserAddedVideos from './components/Videos/UserAddedVideos'
import VideosIndexPage from './components/Videos/VideosIndexPage'

const CFRouter = () => (
  <Router>
    <Layout>
      <Switch>
        <Route path="/" exact component={Home} />
        <Route path="/signup" exact component={SignupForm} />
        <Route path="/login" exact component={LoginForm} />
        <Route path="/logout" exact component={LogoutPage} />
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

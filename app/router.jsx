// Import libs
import React from 'react'
import { Router, Route, IndexRoute, browserHistory } from 'react-router'
import Loadable from 'react-loadable'
import { LoadingFrame } from './components/Utils/LoadingFrame'

// Views that can't be dynamically loaded
import { BrowserExtensionsPage } from './components/Pages'

// Dynamically loaded Views
const App = Loadable({
  loader: () => import('./components/App'),
  loading: LoadingFrame
})

const Home = Loadable({
  loader: () => import('./components/Home/Home'),
  loading: LoadingFrame
})

const NotFound = Loadable({
  loader: () => import('./components/Pages/NotFound'),
  loading: LoadingFrame
})

const AddVideoForm = Loadable({
  loader: () => import('./components/Videos/AddVideoForm'),
  loading: LoadingFrame
})

const VideosIndexPage = Loadable({
  loader: () => import('./components/Videos/VideosIndexPage'),
  loading: LoadingFrame
})

const VideoDebate = Loadable({
  loader: () => import('./components/VideoDebate'),
  loading: LoadingFrame
})

const Help = Loadable({
  loader: () => import('./components/Help/Help'),
  loading: LoadingFrame
})

const UserProfile = Loadable({
  loader: () => import('./components/Users/UserProfile'),
  loading: LoadingFrame
})

const ThirdPartyCallback = Loadable({
  loader: () => import('./components/Users/ThirdPartyCallback'),
  loading: LoadingFrame
})

const UserSettings = Loadable({
  loader: () => import('./components/Users/UserSettings'),
  loading: LoadingFrame
})

const LoginForm = Loadable({
  loader: () => import('./components/Users/LoginForm'),
  loading: LoadingFrame
})

const SignupForm = Loadable({
  loader: () => import('./components/Users/SignupForm'),
  loading: LoadingFrame
})

const User = Loadable({
  loader: () => import('./components/Users/User'),
  loading: LoadingFrame
})

const ResetPasswordRequestForm = Loadable({
  loader: () => import('./components/Users/ResetPasswordRequestForm'),
  loading: LoadingFrame
})

const ResetPasswordConfirmForm = Loadable({
  loader: () => import('./components/Users/ResetPasswordConfirmForm'),
  loading: LoadingFrame
})

const ConfirmEmail = Loadable({
  loader: () => import('./components/Users/ConfirmEmail'),
  loading: LoadingFrame
})

const ActivityLog = Loadable({
  loader: () => import('./components/Users/ActivityLog'),
  loading: LoadingFrame
})

const NewsletterSubscription = Loadable({
  loader: () => import('./components/Users/NewsletterSubscription'),
  loading: LoadingFrame
})

const Moderation = Loadable({
  loader: () => import('./components/Moderation/Moderation'),
  loading: LoadingFrame
})

const SpeakerPage = Loadable({
  loader: () => import('./components/Speakers/SpeakerPage'),
  loading: LoadingFrame
})


const CFRouter = () => (
  <Router history={browserHistory}>
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
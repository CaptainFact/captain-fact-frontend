// Import libs
import React from 'react'
import { Router, Route, IndexRoute, browserHistory } from 'react-router'
import Loadable from 'react-loadable'

// Views that can't be dynamically loaded
import { BrowserExtensionsPage } from './components/Pages'

// Loading component
const Loading = (props) => {
  const { pastDelay } = props
  if (pastDelay) return <div className='loading-frame'>
    <div className="spinner" />
  </div>
  return null
}

const dynamicViewOptions = {
  loading: Loading,
  delay: 750,
}

// Dynamically loaded Views
const App = Loadable({
  loader: () => import('./components/App'),
  ...dynamicViewOptions,
})

const Home = Loadable({
  loader: () => import('./components/Home/Home'),
  ...dynamicViewOptions,
})

const NotFound = Loadable({
  loader: () => import('./components/Pages/NotFound'),
  ...dynamicViewOptions,
})

const AddVideoForm = Loadable({
  loader: () => import('./components/Videos/AddVideoForm'),
  ...dynamicViewOptions,
})

const VideosIndexPage = Loadable({
  loader: () => import('./components/Videos/VideosIndexPage'),
  ...dynamicViewOptions,
})

const VideoDebate = Loadable({
  loader: () => import('./components/VideoDebate'),
  ...dynamicViewOptions,
})

const Help = Loadable({
  loader: () => import('./components/Help/Help'),
  ...dynamicViewOptions,
})

const UserProfile = Loadable({
  loader: () => import('./components/Users/UserProfile'),
  ...dynamicViewOptions,
})

const ThirdPartyCallback = Loadable({
  loader: () => import('./components/Users/ThirdPartyCallback'),
  ...dynamicViewOptions,
})

const UserSettings = Loadable({
  loader: () => import('./components/Users/UserSettings'),
  ...dynamicViewOptions,
})

const LoginForm = Loadable({
  loader: () => import('./components/Users/LoginForm'),
  ...dynamicViewOptions,
})

const SignupForm = Loadable({
  loader: () => import('./components/Users/SignupForm'),
  ...dynamicViewOptions,
})

const User = Loadable({
  loader: () => import('./components/Users/User'),
  ...dynamicViewOptions,
})

const ResetPasswordRequestForm = Loadable({
  loader: () => import('./components/Users/ResetPasswordRequestForm'),
  ...dynamicViewOptions,
})

const ResetPasswordConfirmForm = Loadable({
  loader: () => import('./components/Users/ResetPasswordConfirmForm'),
  ...dynamicViewOptions,
})

const ConfirmEmail = Loadable({
  loader: () => import('./components/Users/ConfirmEmail'),
  ...dynamicViewOptions,
})

const ActivityLog = Loadable({
  loader: () => import('./components/Users/ActivityLog'),
  ...dynamicViewOptions,
})

const NewsletterSubscription = Loadable({
  loader: () => import('./components/Users/NewsletterSubscription'),
  ...dynamicViewOptions,
})

const Moderation = Loadable({
  loader: () => import('./components/Moderation/Moderation'),
  ...dynamicViewOptions,
})

const SpeakerPage = Loadable({
  loader: () => import('./components/Speakers/SpeakerPage'),
  ...dynamicViewOptions,
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
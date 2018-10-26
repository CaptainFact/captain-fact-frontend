export default {
  title: 'Error',
  server: {
    unknown: 'Something didn\'t work on our side, we\'ll check it out!',
    invalid_email: 'Invalid email address',
    invalid_token: 'Verification code is either invalid or expired',
    invalid_invitation_token: 'Invitation code is either invalid or expired',
    reset_failed: 'Reset password failed',
    authentication_failed: 'Authentication failed',
    invalid_email_password: 'Invalid email / password combination',
    not_enough_reputation: 'You don\'t have enough reputation to do that',
    limit_reached: 'You reached your daily limit for this action',
    not_found: 'It looks like this doesn\'t exist, try to refresh the page if the problem persists',
    action_already_done: 'This action has already been done',
    unauthenticated: 'You need an account to do that',
    unauthorized: 'Please (re)connect to continue',
    noInternet: 'Server connection failed, try refreshing the page'
  },
  client: {
    joinCrashed: 'Server connection failed',
    thirdParty: 'Third party authentication failed',
    submissionError: 'An error occurred while sending the data',
    noVideoAvailable: 'No video available',
    notEnoughReputation: 'Not enough reputation to access this feature',
    needReputation: 'You need at least {{requiredRep}} <2>reputation</2> points to do that'
  }
}

import React from "react"
import { reduxForm } from "redux-form"
import { withNamespaces } from "react-i18next"
import { connect } from "react-redux"
import { passwordField, passwordRepeatField } from "./UserFormFields"
import {
  resetPasswordRequest,
  resetPasswordVerify,
  resetPasswordConfirm,
  login,
} from "../../state/users/current_user/effects"
import { LoadingFrame } from "../Utils/LoadingFrame"
import { ErrorView } from "../Utils/ErrorView"
import UserPicture from "./UserPicture"
import { USER_PICTURE_XLARGE } from "../../constants"
import UserAppellation from "./UserAppellation"
import Notification from "../Utils/Notification"
import { handleEffectResponse } from "../../lib/handle_effect_response"

// Fields are auto-validated, only validate password and repeat are the same
const validate = (params) => {
  if (params.password) return params.password === params.passwordRepeat ? {} : { passwordRepeat: "Doesn't match" }
  return {}
}

@reduxForm({ form: "resetPassword", validate })
@withNamespaces("user")
@connect(
  null,
  { resetPasswordRequest, resetPasswordVerify, resetPasswordConfirm, login },
)
export default class ResetPasswordConfirmForm extends React.PureComponent {
  constructor(props) {
    super(props)
    this.state = { status: "waiting_verification", payload: null }
  }

  componentDidMount() {
    this.props.resetPasswordVerify(this.props.params.token).then(
      handleEffectResponse({
        onSuccess: (user) => this.setState({ status: "confirm", payload: user }),
        onError: () => this.setState({ status: "error", payload: "invalid_token" }),
      }),
    )
  }

  submitForm(e) {
    this.props
      .resetPasswordConfirm({
        password: e.password,
        token: this.props.params.token,
      })
      .then(
        handleEffectResponse({
          onSuccess: () => {
            this.props.login({
              provider: "identity",
              params: { email: this.state.payload.email, password: e.password },
            })
            this.setState({ status: "confirm_success" })
          },
          onError: () => this.setState({ status: "error", payload: "reset_failed" }),
        }),
      )
  }

  renderContent() {
    if (this.state.status === "error")
      return <ErrorView error={this.state.payload} i18nNS="user:errors.error" canGoBack={false} />
    if (this.state.status === "verify") return <LoadingFrame />
    if (this.state.status === "confirm") {
      const user = this.state.payload
      return (
        <div>
          <div className="user-box">
            <UserPicture user={user} size={USER_PICTURE_XLARGE} />
            <UserAppellation user={user} withoutActions />
          </div>
          {passwordField(this.props.t)}
          {passwordRepeatField(this.props.t)}
          <button type="submit" className="button">
            {this.props.t("resetPassword")}
          </button>
        </div>
      )
    }
    if (this.state.status === "confirm_success")
      return <Notification>{this.props.t("resetPasswordSuccess")}</Notification>
  }

  render() {
    return (
      <form className="form user-form" onSubmit={this.props.handleSubmit(this.submitForm.bind(this))}>
        {this.renderContent()}
      </form>
    )
  }
}

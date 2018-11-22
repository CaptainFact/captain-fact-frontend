import React from "react"
import { reduxForm } from "redux-form"
import { withNamespaces } from "react-i18next"
import { connect } from "react-redux"
import { emailField } from "./UserFormFields"
import { resetPasswordRequest, resetPasswordVerify, resetPasswordConfirm } from "../../state/users/current_user/effects"
import { ErrorView } from "../Utils/ErrorView"
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
  { resetPasswordRequest, resetPasswordVerify, resetPasswordConfirm },
)
export default class ResetPasswordRequestForm extends React.PureComponent {
  constructor(props) {
    super(props)
    this.state = { status: "ready", payload: null }
  }

  submitForm(e) {
    this.props.resetPasswordRequest(e).then(
      handleEffectResponse({
        onSuccess: () => this.setState({ status: "done" }),
        onError: () => this.setState({ status: "error", payload: "reset_failed" }),
      }),
    )
  }

  renderContent() {
    if (this.state.status === "error")
      return <ErrorView error={this.state.payload} i18nNS="user:errors.error" canGoBack={false} />
    if (this.state.status === "ready")
      return (
        <div>
          {emailField(this.props.t)}
          <button type="submit" className="button">
            {this.props.t("resetPassword")}
          </button>
        </div>
      )
    if (this.state.status === "done") return <Notification>{this.props.t("resetPasswordRequestSuccess")}</Notification>
  }

  render() {
    return (
      <form className="form user-form" onSubmit={this.props.handleSubmit(this.submitForm.bind(this))}>
        {this.renderContent()}
      </form>
    )
  }
}

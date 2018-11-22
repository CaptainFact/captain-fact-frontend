import React from "react"
import { LoadingFrame } from "./LoadingFrame"
import { handleEffectResponse } from "../../lib/handle_effect_response"

export default class AsyncEffect extends React.PureComponent {
  componentDidMount() {
    this.props.effect().then(
      handleEffectResponse({
        onSuccess: this.props.onSuccess,
        onError: this.props.onError,
      }),
    )
  }

  render() {
    return <LoadingFrame />
  }
}

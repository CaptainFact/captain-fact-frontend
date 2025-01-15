import { Facebook, Github, Twitter } from 'lucide-react'
import React from 'react'
import { Discord } from 'styled-icons/remix-line'

import ExternalLinkNewTab from '../Utils/ExternalLinkNewTab'

const SocialIconLink = ({ Icon, size, name, url }) => {
  return (
    <ExternalLinkNewTab
      title={name}
      href={url}
      className="mx-2 transition-all duration-300 hover:opacity-80 hover:scale-110 hover:-rotate-6 text-white hover:text-white/90"
    >
      <Icon size={size ?? 32} className="text-current" />
    </ExternalLinkNewTab>
  )
}

const CFSocialProfiles = () => {
  return (
    <div className="flex justify-center items-center gap-4">
      <SocialIconLink
        name="Discord"
        Icon={Discord}
        size={38}
        url="https://discord.captainfact.io"
      />
      <SocialIconLink name="Github" Icon={Github} url="https://github.com/CaptainFact" />
      <SocialIconLink name="Twitter" Icon={Twitter} url="https://twitter.com/CaptainFact_io" />
      <SocialIconLink
        name="Facebook"
        Icon={Facebook}
        url="https://www.facebook.com/CaptainFact.io"
      />
    </div>
  )
}

export default CFSocialProfiles

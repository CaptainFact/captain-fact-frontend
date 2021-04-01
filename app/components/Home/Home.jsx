import React from 'react'
import { Link } from 'react-router'
import { withNamespaces, Trans } from 'react-i18next'
import { Flex, Box } from '@rebass/grid'
import { Discourse } from 'styled-icons/fa-brands'
import { ExternalLinkAlt } from 'styled-icons/fa-solid'

import * as Matomo from '../../API/matomo'
import { Icon } from '../Utils'
import InvitationRequestForm from '../Users/InvitationRequestForm'
import { INVITATION_SYSTEM } from '../../config'
import AllPartners from './AllPartners'
import OpenCollectiveContributors from './OpenCollectiveContributors'
import AllTeam from './AllTeam'
import ExternalLinkNewTab from '../Utils/ExternalLinkNewTab'
import CFSocialProfiles from './CFSocialProfiles'
import LastVideos from './LastVideos'
import { withLoggedInUser } from '../LoggedInUser/UserProvider'
import imgMedia from '../../assets/media.jpg'
import imgExample1 from '../../assets/example1.jpg'
import examplesImg1 from '../../assets/examples/image-1.jpg'
import examplesImg2 from '../../assets/examples/image-2.jpg'
import examplesImg3 from '../../assets/examples/image-3.jpg'
import imgIllutration from '../../assets/landing-illustration.png'
import Container from '../StyledUtils/Container'

@withNamespaces('home')
@withLoggedInUser
export default class Home extends React.PureComponent {
  render() {
    const { t } = this.props

    return (
      <div className="home-page is-gradient-primary">
        <section className="hero">
          <div className="hero-body">
            <div className="columns">
              <div className="column is-11 is-10-tablet is-12-mobile">
                <h1 className="title1">
                  Captain
                  <strong>
                    <u>Fact</u>.
                  </strong>
                </h1>
                <br />
                <h2 className="title">{t('titleCF')}</h2>
                <h2 className="title light-title">
                  <Trans i18nKey="presentationTitle">
                    To train a critical mind, improve the quality of information and
                    decision-making.
                    <br />
                    Against fake news, fraud and disinformation
                  </Trans>
                </h2>
                <p className="presentation is-bold">{t('presentation')}</p>
                <div className="columns">
                  <div className="column is-5">
                    <p className="presentation">{t('presentationTextButton1')}</p>
                    <p>
                      <Link
                        onClick={() => Matomo.registerClick('Home', 'Button', 'ExtensionPage')}
                        className="button is-primary is-medium"
                        to="/extension"
                      >
                        {this.props.t('installExtension')}
                      </Link>
                    </p>
                  </div>
                  <div className="column is-5">
                    <p className="presentation">{t('presentationTextButton2')}</p>
                    <p>
                      <Link
                        onClick={() => Matomo.registerClick('Home', 'Button', 'SignUp')}
                        className="button is-primary is-medium"
                        to="/signup"
                      >
                        {this.props.t('registerAndFactCheck')}
                      </Link>
                    </p>
                  </div>
                </div>
              </div>
              <div className="column is-11 is-10-tablet is-12-mobile">
                <img src={imgMedia} alt="media effects" className="header-img" />
              </div>
            </div>
          </div>
        </section>

        {this.props.lng === 'fr' && (
          <section className="section has-background-white has-text-centered">
            <div className="hero-body" style={{ maxWidth: 720, margin: '0 auto' }}>
              <div style={{ position: 'relative', height: 0, paddingBottom: '56.25%' }}>
                <iframe
                  style={{
                    position: 'absolute',
                    top: '0.75rem',
                    left: '0.75rem',
                    width: '100%',
                    height: '100%',
                  }}
                  width="100%"
                  height="100%"
                  src="https://www.youtube.com/embed/Hox_CHmC-so"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            </div>
          </section>
        )}

        <section className="section section-alt-bg has-text-centered">
          <h2 className="title-alt">
            <strong>{t('headerPunchline')}</strong>
            <br />
            {t('headerPunchline2')}
          </h2>
        </section>

        <section className="section hero has-background-white">
          <div className="hero-body">
            <div className="columns">
              <div className="column is-6">
                <br />
                <br />
                <img src={examplesImg1} alt="exemple image captainfact" />
                <br />
                <br />
              </div>
              <div className="column is-6 presentation content">
                <br />
                <br />
                <h2 className="title-alt">{t('example1Title1')}</h2>
                <h2 className="title light-title is-3">{t('example1Title2')}</h2>
                <p>
                  {t('example1Text')}
                  <br />
                </p>
                <Link
                  onClick={() => Matomo.registerClick('Home', 'Button', 'ExtensionPage')}
                  className="button is-primary is-medium"
                  to="/extension"
                >
                  {t('installExtension')}
                </Link>
              </div>
            </div>
            <div className="columns">
              <div className="column is-6 presentation content">
                <br />
                <br />
                <h2 className="title-alt">{t('example2Title1')}</h2>
                <h2 className="title light-title is-3">{t('example2Title2')}</h2>
                <p>
                  {t('example2Text')}
                  <br />
                </p>
                <Link
                  onClick={() => Matomo.registerClick('Home', 'Button', 'SignUp')}
                  className="button is-primary is-medium"
                  to="/signup"
                >
                  {t('registerAndFactCheck')}
                </Link>
              </div>
              <div className="column is-6 ">
                <br />
                <br />
                <img src={examplesImg2} alt="exemple image captainfact" />
                <br />
                <br />
              </div>
            </div>
            <div className="columns">
              <div className="column is-6">
                <br />
                <br />
                <img src={examplesImg3} alt="exemple image captainfact" />
                <br />
                <br />
              </div>
              <div className="column is-6 presentation content">
                <br />
                <br />
                <h2 className="title-alt">{t('example3Title1')}</h2>
                <h2 className="title light-title is-3">{t('example3Title2')}</h2>
                <p>
                  {t('example3Text')}
                  <br />
                </p>
                <ExternalLinkNewTab
                  className="button is-primary is-medium"
                  href="https://github.com/CaptainFact/captain-fact/wiki/Les-partenariats-entre-les-chaînes-Youtube-et-CaptainFact.io"
                >
                  {t('learnMore')} (fr)
                </ExternalLinkNewTab>
              </div>
            </div>
          </div>
        </section>

        <section className="section hero section-alt-bg">
          <div className="hero-body">
            <div className="columns">
              <div className="column is-6">
                <h2 className="title-alt is-bold">{t('forWho1Title1')}</h2>
                <h2 className="title light-title is-3">{t('forWho1Title2')}</h2>
                <p className="presentation">{t('forWho1Text')}</p>
              </div>
              <div className="column is-6">
                <h2 className="title-alt is-bold">{t('forWho2Title1')}</h2>
                <h2 className="title light-title is-3">{t('forWho2Title2')}</h2>
                <p className="presentation">{t('forWho2Text')}</p>
              </div>
            </div>
            <Link
              onClick={() => Matomo.registerClick('Home', 'Button', 'ContactUs')}
              className="button is-primary is-medium"
              to="/help/contact"
            >
              {t('contactus')}
            </Link>
          </div>
        </section>

        <section className="hero is-medium">
          <div className="hero-body">
            <div className="columns">
              <div className="column is-6 presentation content">
                <br />
                <br />
                <h2 className="title is-3">{t('howTitle')}</h2>
                <Container color="black.600">
                  {t('how')}
                  <br />
                  <ol>
                    <li>{t('how1')}</li>
                    <li>{t('how2')}</li>
                    <li>{t('how3')}</li>
                  </ol>
                </Container>
                <p>{t('how4')}</p>
                <br />
                <Link
                  onClick={() => Matomo.registerClick('Home', 'Button', 'ExtensionPage')}
                  className="button animated-hover is-medium is-gradient-primary-light"
                  to="/extension"
                >
                  {t('installExtension')}
                </Link>
              </div>
              <div className="column is-6">
                <br />
                <br />
                <img src={imgExample1} alt="exemple video captainfact" />
                <br />
                <ExternalLinkNewTab href="https://www.youtube.com/watch?v=LsRkg2hRTiI">
                  {t('demo')} <ExternalLinkAlt size="1em" />
                </ExternalLinkNewTab>
                <br />
                <br />
              </div>
            </div>
          </div>
        </section>

        <section className="hero is-medium">
          <div className="hero-body">
            <div className="columns">
              <div className="column is-6">
                <br />
                <br />
                <img src={imgIllutration} alt="community" />
              </div>
              <div className="column is-6">
                <h2 className="title is-3">{t('whoTitle')}</h2>
                <p className="presentation">{t('who')}</p>
                <br />
                <Link
                  onClick={() => Matomo.registerClick('Home', 'Button', 'SignUp')}
                  className="button animated-hover is-medium is-gradient-primary-light"
                  to="/signup"
                >
                  {t('registerAndFactCheck')}
                </Link>
                <br />
                <br />
                <ExternalLinkNewTab href="https://forum.captainfact.io/">
                  <Discourse size="1.5em" /> {t('forum')}
                </ExternalLinkNewTab>

                <br />
                <br />
              </div>
            </div>
          </div>
        </section>

        <section className="section section-alt-bg has-text-centered">
          <h2 className="title-alt">
            <strong>{t('helpCaptain1')}</strong>
            <br />
            {t('helpCaptain2')}
          </h2>
        </section>

        <section className="section hero has-background-white">
          <div className="hero-body">
            <div className="columns">
              <div className="column is-6">
                <h2 className="title-alt is-bold">{t('backendDevelopers')}</h2>
                <p className="presentation">{t('backendDevelopersText')}</p>
                <ExternalLinkNewTab href="https://github.com/CaptainFact/captain-fact/labels/backend">
                  {t('backendDevelopersLink')}
                </ExternalLinkNewTab>
                <br />
                <br />
                <h2 className="title-alt is-bold">{t('frontendDevelopers')}</h2>
                <p className="presentation">{t('frontendDevelopersText')}</p>
                <ExternalLinkNewTab href="https://github.com/CaptainFact/captain-fact-frontend/issues">
                  {t('frontendDevelopersLink')}
                </ExternalLinkNewTab>
                <br />
                <br />
                <h2 className="title-alt is-bold">{t('designer')}</h2>
                <p className="presentation">{t('designerText')}</p>
                <br />
                <br />
                <h2 className="title-alt is-bold">{t('graphicDesigners')}</h2>
                <p className="presentation">{t('graphicDesignersText')}</p>
              </div>
              <div className="column is-6">
                <h2 className="title-alt is-bold">{t('animator')}</h2>
                <p className="presentation">{t('animatorText')}</p>
                <br />
                <br />
                <h2 className="title-alt is-bold">{t('communicationsSpecialists')}</h2>
                <p className="presentation">{t('communicationsSpecialistsText')}</p>
                <br />
                <br />
                <h2 className="title-alt is-bold">{t('translator')}</h2>
                <p className="presentation">{t('translatorText')}</p>
              </div>
            </div>
            <div className="has-text-centered presentation">
              <br />
              <br />
              <Link
                onClick={() => Matomo.registerClick('Home', 'Button', 'ContactUs')}
                className="button is-primary is-medium"
                to="/help/contact"
              >
                {t('contactus')}
              </Link>
              <br />
              <br />
              <p>
                {t('fundUsText')}{' '}
                <ExternalLinkNewTab href="https://opencollective.com/captainfact_io">
                  {t('fundUsLink')}
                </ExternalLinkNewTab>
              </p>
              <br />
              <br />
            </div>
          </div>
          <div className="has-text-centered">
            <h2 className="title-alt is-3 is-bold">{t('followus')}</h2>
          </div>
        </section>

        <section className="section">
          <CFSocialProfiles size="3em" color="white" />
        </section>

        <section className="section partners">
          <div className="content">
            <h2 className="title is-3 has-text-centered">{t('partners')}</h2>
            <ExternalLinkNewTab
              href="https://github.com/CaptainFact/captain-fact/wiki/Les-partenariats-entre-les-chaînes-Youtube-et-CaptainFact.io"
              className="is-block has-text-centered"
            >
              {t('partners-info')} <ExternalLinkAlt size="1em" />
            </ExternalLinkNewTab>
            <br />
            <AllPartners />
          </div>
        </section>

        <section className="section last-videos" style={{ paddingBottom: '3em' }}>
          <div className="has-text-centered">
            <h2 className="title is-3">{t('latest')}</h2>
            <Link
              onClick={() => Matomo.registerClick('Home', 'Button', 'SeeAllVideos')}
              className="button animated-hover is-medium is-gradient-primary-light"
              to="/videos"
            >
              {t('seeVideos')}
            </Link>
          </div>
          <br />
          <br />
          <div className="last-videos-cards">
            <LastVideos />
          </div>
        </section>

        <section className="section partners">
          <div className="content">
            <Flex flexDirection="column" flexWrap="wrap">
              <Box>
                <h2 className="title is-3">{t('technicalTeamAndAmbassadors')}</h2>
                <p className="presentation">
                  {t('aboutAmbassadors')} <Link to="/help/ambassadors">{t('learnMore')}</Link>
                </p>
                <AllTeam />
              </Box>
              <Box mb="2em">
                <h2 className="title is-3">{t('financialContributors')}</h2>
                <h4 className="has-text-weight-bold">{t('membersOfTheAssociation')}</h4>
                <OpenCollectiveContributors
                  tier="adhesion-membre"
                  width={600}
                  limit={15}
                  avatarHeight={36}
                />
                <br />
                <h4 className="has-text-weight-bold">{t('regularFinancialContributors')}</h4>
                <OpenCollectiveContributors
                  tier="soutien-regulier"
                  width={600}
                  limit={15}
                  avatarHeight={36}
                />
                <br />
                <h4 className="has-text-weight-bold">{t('donators')}</h4>
                <OpenCollectiveContributors
                  tier="donateur"
                  width={600}
                  limit={15}
                  avatarHeight={36}
                />
              </Box>
            </Flex>
            <ExternalLinkNewTab
              href="https://opencollective.com/captainfact_io"
              className="button is-primary is-medium"
            >
              {t('crowdfunding')}
            </ExternalLinkNewTab>
            <br />
          </div>
        </section>

        {INVITATION_SYSTEM && (
          <section className="section request-invitation">
            <h4 className="title is-4" style={{ color: 'white' }}>
              <Icon name="envelope-o" />
              <span>
                &nbsp;&nbsp;
                {t(this.props.isAuthenticated ? 'inviteFriend' : 'invitation')}
              </span>
            </h4>
            <InvitationRequestForm />
          </section>
        )}
        <footer className="footer">
          <div className="has-text-centered">
            <Trans i18nKey="footer">
              Created with <Icon name="heart" /> using
            </Trans>
            <ExternalLinkNewTab href="https://elixir-lang.org">Elixir</ExternalLinkNewTab>
            ,&nbsp;
            <ExternalLinkNewTab href="https://phoenixframework.org">Phoenix</ExternalLinkNewTab>
            &nbsp;{t('main:misc.and')}&nbsp;
            <ExternalLinkNewTab href="https://reactjs.org/">React</ExternalLinkNewTab>
          </div>
        </footer>
      </div>
    )
  }
}

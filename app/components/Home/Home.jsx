import { ExternalLink, ListVideo, LogIn, Mail, Puzzle } from 'lucide-react'
import React from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

import { checkExtensionInstall } from '@/lib/browser-extension'

import imgExample1 from '../../assets/example1.jpg'
import examplesImg1 from '../../assets/examples/image-1.jpg'
import examplesImg2 from '../../assets/examples/image-2.jpg'
import examplesImg3 from '../../assets/examples/image-3.jpg'
import { useLoggedInUser } from '../LoggedInUser/UserProvider'
import Container from '../StyledUtils/Container'
import { Button } from '../ui/button'
import ExternalLinkNewTab from '../Utils/ExternalLinkNewTab'
import CFSocialProfiles from './CFSocialProfiles'
import LastVideos from './LastVideos'

const Home = () => {
  const {
    t,
    i18n: { language },
  } = useTranslation('home')
  const { isAuthenticated } = useLoggedInUser()
  const [hasBrowserExtension, setHasBrowserExtension] = React.useState(false)

  React.useEffect(() => {
    checkExtensionInstall().then((hasExtension) => {
      setHasBrowserExtension(hasExtension)
    })
  }, [])

  return (
    <div>
      <section className="py-16 sm:py-32">
        <div className="container mx-auto px-4">
          <div className="lg:flex lg:space-x-8 lg:items-center">
            <div className="lg:w-7/12">
              <h1 className="text-4xl sm:text-6xl font-medium mb-4 font-serif tracking-wide">
                Captain
                <strong>
                  <u>Fact</u>.
                </strong>
              </h1>
              <br />
              <h2 className="text-2xl sm:text-3xl font-semibold mb-1">{t('titleCF')}</h2>
              <h2 className="text-xl font-light mb-2">
                <Trans i18nKey="home:presentationTitle">
                  To train a critical mind, improve the quality of information and decision-making.
                </Trans>
              </h2>
              <p className="italic mb-6">{t('presentation')}</p>
              <div className="flex flex-wrap gap-4">
                <div className="w-full md:w-5/12">
                  <p className="font-bold mb-4 min-h-[72px]">{t('presentationTextButton1')}</p>
                  {!hasBrowserExtension && (
                    <Link to="/extension">
                      <Button variant="outline" className="h-auto">
                        <Puzzle size="1em" />
                        {t('installExtension')}
                      </Button>
                    </Link>
                  )}
                </div>
                <div className="w-full md:w-5/12">
                  <p className="font-bold mb-4 min-h-[72px]">{t('presentationTextButton2')}</p>
                  {!isAuthenticated && (
                    <Link to="/signup">
                      <Button className="h-auto">
                        <LogIn size="1em" />
                        {t('registerAndFactCheck')}
                      </Button>
                    </Link>
                  )}
                </div>
              </div>
            </div>
            <div className="w-full lg:w-5/12 mt-8 lg:mt-0">
              <div className="relative w-full aspect-video">
                <iframe
                  className="absolute top-0 left-0 w-full h-full"
                  src={
                    language === 'fr'
                      ? 'https://www.youtube.com/embed/BxriDuVUuMQ'
                      : 'https://www.youtube.com/embed/cZn72yBtIFw'
                  }
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  title="CaptainFact Presentation"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 bg-gray-100">
        <div className="container mx-auto px-4">
          {/* First row */}
          <div className="flex flex-wrap -mx-4 mb-16">
            <div className="w-full md:w-6/12 px-4 mb-8 md:mb-0">
              <h2 className="text-3xl font-semibold mb-4">{t('howTitle')}</h2>
              <Container color="black.600">
                {t('how')}
                <ol className="list-decimal pl-6 space-y-2 mt-2 mb-4">
                  <li className="ml-2">{t('how1')}</li>
                  <li className="ml-2">{t('how2')}</li>
                  <li className="ml-2">{t('how3')}</li>
                </ol>
              </Container>
              <p>{t('how4')}</p>
              <ExternalLinkNewTab href="https://www.youtube.com/watch?v=LsRkg2hRTiI">
                <Button variant="outline" className="mt-4">
                  {t('demo')} <ExternalLink size={16} />
                </Button>
              </ExternalLinkNewTab>
            </div>
            <div className="w-full md:w-6/12 px-4">
              <img src={imgExample1} alt="exemple video captainfact" className="mb-4 w-full" />
            </div>
          </div>

          {/* Second row */}
          <div className="flex flex-wrap -mx-4 mb-16">
            <div className="w-full md:w-6/12 px-4 mb-8 md:mb-0">
              <img src={examplesImg1} alt="CaptainFact interface example" className="w-full" />
            </div>
            <div className="w-full md:w-6/12 px-4">
              <div className="md:pl-8">
                <h2 className="text-3xl font-semibold mb-4">{t('example1Title1')}</h2>
                <h2 className="text-2xl font-light mb-4">{t('example1Title2')}</h2>
                <p className="mb-6">{t('example1Text')}</p>
                <Link to="/extension">
                  <Button variant="outline">
                    <Puzzle size="1em" />
                    {t('installExtension')}
                  </Button>
                </Link>
              </div>
            </div>
          </div>

          {/* Third row */}
          <div className="flex flex-wrap -mx-4 mb-16">
            <div className="w-full md:w-6/12 px-4 mb-8 md:mb-0">
              <div className="md:pr-8">
                <h2 className="text-3xl font-semibold mb-4">{t('example2Title1')}</h2>
                <h2 className="text-2xl font-light mb-4">{t('example2Title2')}</h2>
                <p className="mb-6">{t('example2Text')}</p>
                <Link to="/signup">
                  <Button variant="outline">
                    <LogIn size={16} />
                    {t('registerAndFactCheck')}
                  </Button>
                </Link>
              </div>
            </div>
            <div className="w-full md:w-6/12 px-4">
              <img src={examplesImg2} alt="CaptainFact interface example" className="w-full" />
            </div>
          </div>

          {/* Fourth row */}
          <div className="flex flex-wrap -mx-4">
            <div className="w-full md:w-6/12 px-4 mb-8 md:mb-0">
              <img src={examplesImg3} alt="CaptainFact interface example" className="w-full" />
            </div>
            <div className="w-full md:w-6/12 px-4">
              <div className="md:pl-8">
                <h2 className="text-3xl font-semibold mb-4">{t('example3Title1')}</h2>
                <h2 className="text-2xl font-light mb-4">{t('example3Title2')}</h2>
                <p className="mb-6">{t('example3Text')}</p>
                <ExternalLinkNewTab href="https://github.com/CaptainFact/captain-fact/wiki/Les-partenariats-entre-les-chaînes-Youtube-et-CaptainFact.io">
                  <Button variant="outline">
                    {t('learnMore')}
                    {language !== 'fr' ? ' (FR)' : ''}
                    <ExternalLink size={16} />
                  </Button>
                </ExternalLinkNewTab>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 pb-16 bg-white">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-semibold">{t('latest')}</h2>
        </div>
        <div className="container mx-auto px-4 mt-12 mb-12">
          <LastVideos />
        </div>
        <div className="flex justify-center mt-3">
          <Link to="/videos">
            <Button variant="outline">
              <ListVideo size={16} />
              {t('seeVideos')}
            </Button>
          </Link>
        </div>
      </section>

      <section className="py-20 bg-gray-100">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap">
            <div className="w-full md:w-1/2 px-4 mb-8 md:mb-0">
              <h2 className="text-2xl font-bold mb-2">{t('forWho1Title1')}</h2>
              <h2 className="text-2xl font-light mb-4">{t('forWho1Title2')}</h2>
              <p className="mb-6">{t('forWho1Text')}</p>
            </div>
            <div className="w-full md:w-1/2 px-4">
              <h2 className="text-2xl font-bold mb-2">{t('forWho2Title1')}</h2>
              <h2 className="text-2xl font-light mb-4">{t('forWho2Title2')}</h2>
              <p className="mb-6">{t('forWho2Text')}</p>
            </div>
          </div>
          <div className="flex justify-center mt-4">
            <Link to="/help/contact">
              <Button variant="outline">
                <Mail size={14} />
                {t('contactus')}
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="py-12 bg-gradient-to-b from-primary/90 to-primary/80 text-white">
        <CFSocialProfiles />
      </section>
    </div>
  )
}

export default Home

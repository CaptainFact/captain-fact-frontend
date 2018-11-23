import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { withNamespaces } from 'react-i18next';
import cxs from 'cxs';

import { isAuthenticated } from '../../state/users/current_user/selectors';
import Logo from '../App/Logo';
import { NewVideoGrid } from '../Videos/NewVideoGrid';
import { videos } from '../../assets/data/videos';

@connect(state => ({ authenticated: isAuthenticated(state) }))
@withNamespaces('home')
export default class NewHome extends React.PureComponent {
    render() {
        const { t } = this.props;

        return (
            <div className={`home-page ${style.home}`}>
                <section className="hero is-medium is-bold">
                    <div className={style.logo}>
                        <Logo />
                    </div>
                    <div className="hero-body has-text-centered">
                        <div className={style.presentation}>
                            <p>
                                {t('presentation1')}
                                <br /><br />
                                <strong>CaptainFact</strong> {t('presentation2')}
                            </p>
                            <br />
                        </div>
                    </div>
                </section>
                <section className={`has-text-centered ${style.buttons}`}>
                    <Link className={style.button} to="/signup">Créer un compte</Link>
                    <Link className={style.primaryButton} to="/login">Me connecter</Link>
                </section>
                <section className={style.videoList}>
                    <h2>Vidéos mises en ligne récemment</h2>
                    <NewVideoGrid videos={videos}/>
                </section>
            </div>
        );
    }
}

const style = {
    home: cxs({
        fontFamily: 'Roboto',
        fontStyle: 'normal',
        fontWeight: 'normal',
        lineHeight: 'normal',
        fontSize: '14px',
        textAlign: 'center',
        display: 'flex',
        alignItems: 'center',
        padding: '0 15vw'
    }),
    logo: cxs({
        marginTop: '50px'
    }),
    presentation: cxs({
        textAlign: 'left',
        width: '50vw',
        fontSize: '18px',
    }),
    buttons: cxs({
        display: 'flex',
        justifyContent: 'space-between',
        width: '50vw'
    }),
    button: cxs({
        border: '1px solid #4ABDAC',
        boxSizing: 'border-box',
        borderRadius: '5px',
        height: '35px',
        marginRight: '5px',
        flex: 1,
        color: '#4ABDAC',
        padding: '6px 0'
    }),
    primaryButton: cxs({
        border: '1px solid #4ABDAC',
        boxSizing: 'border-box',
        borderRadius: '5px',
        height: '35px',
        marginLeft: '5px',
        flex: 1,
        backgroundColor: '#4ABDAC',
        color: 'white',
        padding: '6px 0'
    }),
    videoList: cxs({
        display: 'block',
        margin: 'auto',
        padding: '5vw 0',
        ' > h2': {
            textAlign: 'left',
            textTransform: 'uppercase',
            color: '#969696',
            margin: '15px 0',
            paddingLeft: '9vw'
        }
    })
};

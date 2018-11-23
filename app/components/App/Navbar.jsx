import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { withNamespaces } from 'react-i18next';
import cxs from 'cxs';

import { Icon } from '../Utils';
import { logout } from '../../state/users/current_user/effects';
import { closeSidebar, toggleSidebar } from '../../state/user_preferences/reducer';
import Logo from './Logo';
import SearchBar from './SearchBar';


@connect(state => ({
    CurrentUser: state.CurrentUser.data,
    isLoadingUser: state.CurrentUser.isLoading
}), { logout, toggleSidebar, closeSidebar })
@withNamespaces('main')
export default class Navbar extends React.PureComponent {
    render() {
        return (
            <nav className={style.navbar} role="navigation" aria-label="main navigation">
                <div className="navbar-brand">
                    <div className={style.logo}>
                        <Link to="/">
                            <Logo borderless />
                        </Link>
                    </div>
                </div>

                <SearchBar />

                <div className="">
                    <div className="navbar-end">
                        <div className="navbar-item">
                            <Link to="/login" className="button is-primary" title="Login / Singup">
                                <Icon size="small" name="sign-in" />
                                <span>Me connecter</span>
                            </Link>

                            <div></div>
                        </div>
                    </div>
                </div>
            </nav>
        );
    }
}

const style = {
    navbar: cxs({
        position: 'fixed',
        top: '0',
        height: '55px',
        width: '100%',
        backgroundColor: 'white',
        padding: '10px',
        borderBottom: 'solid 1px #C4C4C4',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        zIndex: '9999'
    }),
    logo: cxs({
        display: 'block',
        margin: 'auto'
    })
};

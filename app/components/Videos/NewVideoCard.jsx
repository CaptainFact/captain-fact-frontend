import React from 'react';
import { Link } from 'react-router';
import { withNamespaces } from 'react-i18next';
import cxs from 'cxs';

import { videoURL } from '../../lib/cf_routes';

@withNamespaces('videoDebate')
export class NewVideoCard extends React.PureComponent {
    render() {
        const { video } = this.props;
        const { hash_id, title, image_url, views_number, date, sponsorized } = video;
        const linkTarget = videoURL(hash_id);

        return (
            <Link to={linkTarget}>
                <div className={style.card}>
                    <figure className={style.picture}>
                        <img className={sponsorized && style.sponsorized} alt="" src={image_url} />
                    </figure>
                    <h3 className={style.title}>{title}</h3>
                    <p className={style.description}>{views_number} vues  - {date}</p>
                </div>
            </Link>
        );
    }
}

const style = {
    card: cxs({
        width: '300px',
        margin: '20px'
    }),
    picture: cxs({
        margin: '0'
    }),
    title: cxs({
        color: 'black',
        textAlign: 'left',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
        fontWeight: '700',
        overflow: 'hidden',
        margin: '3px 0'
    }),
    description: cxs({
        color: 'black',
        textAlign: 'left',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
        fontWeight: 'normal',
        overflow: 'hidden',
    }),
    sponsorized: cxs({
        borderLeft: 'solid 7px #4ABDAC'
    }),
};

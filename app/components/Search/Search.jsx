import React from 'react';
import cxs from 'cxs';

export default class Search extends React.PureComponent {
    findQuery(query) {
        console.log(query);
    }

    render() {
        const { navigation } = this.props;
        const query = navigation.getParam('query', 'Aucune recherche lancée');

        return (
            <div className={`search-page ${style.search}`}>
                Page de recherche du mot clé {query}
            </div>
        );
    }
}

const style = {
    search: cxs({
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
};

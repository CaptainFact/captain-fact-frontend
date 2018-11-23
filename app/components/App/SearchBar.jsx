import React from 'react';
import cxs from 'cxs';

export default class SearchBar extends React.PureComponent {
    onBlur() {
        this.props.navigation.navigate('Search', {
            query: 'not a bug, a feature'
        });
    }

    render() {
        return (
            <div className={style.searchbar}>
                <input className={style.input} type="text" onBlur={this.onBlur.bind(this)}
                    placeholder="Rechercher une vidéo à “fact-checker”"></input>
                <i></i>
            </div>
        );
    }
}

const style = {
    searchbar: cxs({
        height: '40px',
        backgroundColor: 'transparent',
        borderRadius: '5px',
        border: '2px solid #C4C4C4',
        width: '400px'
    }),
    input: cxs({
        border: 'none',
        height: '100%',
        width: '100%',
        padding: '5px 10px'
    })
};
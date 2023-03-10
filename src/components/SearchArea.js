import React, { Component } from 'react';
import axios from 'axios';
import FilterArea from './FilterArea';
import BarArea from './BarArea';

class SearchArea extends Component {

    // inputText: Search bar text, string
    // filters: List of search filters, string[]
    // sort: Attribute to sort by, string
    // ascending: Order to sort by, boolean
    constructor(props) {
        super(props);
        this.state = {
            inputText: '',
            filters: [],
            sort: '',
            ascending: true
        };
        document.addEventListener(
            "keydown",
            this.handleSpace);
    }

    handleSpace = (event) => {
        if (event.keyCode === 13) {
            this.getSearch();
            // console.log('lol')
        }
    }

    // Function to update inputText based on input field
    updateText = (event) => {
        let newState = {
            ...this.state,
            inputText: event.target.value
        };
        this.setState(newState);
    };

    // Function to set sort method
    // through radio buttons
    setSort = (val) => {
        if (this.state.sort === val) {
            return;
        }
        this.setState((state) => ({
            ...state,
            sort: val
        }), () => this.getSearch());
    }

    // Function to toggle ascending/descending 
    // sort through toggle button
    toggleSort = () => {
        this.setState({
            ...this.state,
            ascending: !this.state.ascending
        }, () => this.getSearch());
    }

    // Function to toggle filters applied
    // through checkboxes
    // Re-searches with new filters after call
    toggleFilter = (filter) => {
        let newFilters = this.state.filters;
        (newFilters.includes(filter) ?
            newFilters.splice(newFilters.indexOf(filter), 1) :
            newFilters.push(filter)
        );
        this.setState({
            ...this.state, filters: newFilters
        }, () => this.getSearch());
    }

    // Function to send HTTP request to CrossRef API
    // Success: Sets resultsList to HTTP response
    // Failure: Throws error message in error field
    getSearch = () => {
        // Check for null input and exit accordingly
        if (this.state.inputText === '') {
            this.props.setResults(null, 'Please enter a search query!');
            return;
        }
        // Build request string for api call
        this.props.setResults(null, '');
        let searchString = 'https://api.crossref.org/works?query=';
        searchString += this.state.inputText.replaceAll(' ', '+');
        searchString += (this.state.sort ?
            '&sort=' + this.state.sort +
            '&order=' + (this.state.ascending ? 'asc' : 'desc')
            : ''
        );
        searchString += (this.state.filters.length > 0 ?
            `&filter=${this.state.filters[0]}:true` : '');
        for (let i = 1; i < this.state.filters.length; i++) {
            searchString += `,${this.state.filters[i]}:true`;
        };
        // Call API and parse results
        axios.get(searchString).then((resp) => {
            if (resp.data) { // Update resultsList with request response
                this.props.setResults(resp.data.message.items, '');
            }
            else { // Improperly formatted response
                this.props.setResults(null, 'ERROR: Could not read response');
            }
        }).catch((err) => { // Catch error and set error message
            this.props.setResults(null, ('ERROR: ' + err.toJSON().message));
        });
    }

    render() {
        return (
            <div className='search-area'>

                {/* Area to choose search filters */}
                < FilterArea
                    sort={this.state.sort}
                    setSort={this.setSort}
                    toggleSort={this.toggleSort}
                    toggleFilter={this.toggleFilter}
                    ascending={this.state.ascending}
                    loadState={this.props.loadState}>
                </FilterArea>

                {/* Area to enter search query */}
                <BarArea
                    updateText={this.updateText}
                    value={this.state.inputText}
                    getSearch={this.getSearch}>
                </BarArea>

            </div >
        )
    }
}

export default SearchArea;
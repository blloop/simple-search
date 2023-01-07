import React, { Component } from 'react';

class ResultsArea extends Component {

    render() {
        return (
            <div className='results-area'>

                {this.props.loadState ?
                    // Loading: return loading indicator
                    <p className='loading'> Loading... </p> :

                    // Not loading: return results list
                    (this.props.resultsList === null ?
                        // No result, must have error returned
                        <p> {this.props.errorMsg} </p> :

                        // Check for 0 results, return message
                        (this.props.resultsList.length === 0 ? (
                            <p className='no-results'> No results found! </p>
                        ) :
                            <>
                                {/* Field to indicate number of results */}
                                <div className='results-count'>
                                    Number of
                                    Results: {this.props.resultsList.length}
                                </div>

                                {/* List of search results rendered */}
                                {this.props.resultsList.map((value) => (
                                    <div
                                        key={value.DOI ? value.DOI : Math.random()}
                                        className='search-result'>
                                        {value['container-title'] ?
                                            value['container-title'] :
                                            'Untitled'
                                        }
                                    </div>
                                ))}
                            </>
                        )
                    )
                }

            </div>
        )
    }
}

export default ResultsArea;
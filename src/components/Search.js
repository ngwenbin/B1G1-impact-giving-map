import React from "react";
import {
  InstantSearch,
  SearchBox,
  Hits,
  connectStateResults,
  PoweredBy ,
} from "react-instantsearch-dom";
import "../index.css";
import algoliasearch from "algoliasearch/lite";
import "simplebar/dist/simplebar.min.css"; // Scroll bar design

const ALGOLIA_TOKEN = process.env.REACT_APP_ALGOLIA_API_TOKEN;

const Search = (params) => {
  const searchClient = algoliasearch(
    "FTGK6O8M29", // Algolia app name
    ALGOLIA_TOKEN // Algolia API key
  );

  const Results = connectStateResults( // Custom algolia search component

    ({ searchState, searchResults }) => {
      const results = searchResults && searchResults.hits;
      return searchState && searchState.query ? ( // Checks if search bar has any queries
        searchResults && searchResults.nbHits !== 0 ? ( // Checks if search has any hits
             <div className="hitsbox">
            {Object.keys(results).map((key, i) => (
              <div className ="hitsbox_results"
                key={i}
                onClick={() =>{
                  params.setSearchBusiness(results[key]) // Set the clicked business data into searchbusiness state
                  params.setBusinessEnabled(false) // Hide business markers
                  params.setProjectEnabled(false) // Hide project markers
                  searchState.query = null // Clear search bar
                }}
              >
                <h4>{results[key].name}</h4>
                <h5>{results[key].country}</h5>
              </div>
            ))}
            <div style={{padding: 7, display: "flex", justifyContent: "center", alignItems: "center", zoom:0.7}}>
              <PoweredBy/>
            </div>
          </div>
        ) : null
      ) : null;
    }
  );
  return (
    <InstantSearch searchClient={searchClient} indexName="test_IMPACTMAP">
      <SearchBox
        translations={{ placeholder: "Search..." }}
      />
        <Results>
          <Hits />
        </Results>
    </InstantSearch>
  );
};

export default Search;

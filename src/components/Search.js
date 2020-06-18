import React, { useState, useEffect } from "react";
import {
  InstantSearch,
  SearchBox,
  Hits,
  connectStateResults,
} from "react-instantsearch-dom";
import "../search.css";
import algoliasearch from "algoliasearch/lite";

const Search = (params) => {
  const searchClient = algoliasearch(
    "FTGK6O8M29",
    "cde8e17b1766a7a49991df605ba1e1ba"
  );
  //const [searchbusiness, setSearchBusiness] = useState([]);

  const Results = connectStateResults(
    ({ searchState, searchResults, children }) => {
      const results = searchResults && searchResults.hits;

      return searchState && searchState.query ? (
        searchResults && searchResults.nbHits !== 0 ? (
          <div className="hitsbox">
            {Object.keys(results).map((key) => (
              <div
                key={key}
                onClick={() =>
                  params.setSearchBusiness(Object.values(results[key].id))
                }
              >
                {Object.values(results[key].name)}
              </div>
            ))}
          </div>
        ) : null
      ) : null;
    }
  );

  return (
    <InstantSearch searchClient={searchClient} indexName="test_IMPACTMAP">
      <SearchBox
        searchAsYouType={false}
        translations={{ placeholder: "Search businesses..." }}
      />
      <Results>
        <Hits />
      </Results>
    </InstantSearch>
  );
};

export default Search;

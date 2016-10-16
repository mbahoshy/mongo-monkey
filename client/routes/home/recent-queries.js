import React, { Component } from 'react';
import Modal from 'components/modal';
import JsonInput, { JsonOverlay } from 'utils/json-input';

const style = {
  padding: '10px',
  borderBottom: '1px solid #e6e6e6',
  fontFamily: 'monospace',
  color: grey,
  float: 'left',
  width: '100%',
};

const grey = '#696969';

const RecentQueries = ({ searchResults, handleOnChange, onToggleRecentQueries, showRecentQueries, search, onSearchChange }) => {
  return (
    <div>
      <div style={{ color: grey, textAlign: 'right', padding: '10px 0px' }}>
        <span onClick={onToggleRecentQueries}>Recent Queries</span>
      </div>
      <Modal id="recent-queries" isOpen={showRecentQueries} close={onToggleRecentQueries}>
        <div>
          <div style={{ color: grey, fontSize: '20px', marginBottom: '10px' }}>Recent Queries</div>
          <JsonInput onChange={onSearchChange} value={search} className="form-control"/>
          <div>
            {showRecentQueries && searchResults && searchResults.map((v, idx) => (
              <div
                style={style}
                onClick={() => {
                  handleOnChange(v.query);
                  onToggleRecentQueries();
                }}
              >
                <JsonOverlay key={idx} value={v.query} />
              </div>
            ))}
          </div>
        </div>
      </Modal>
    </div>
  )
}

class RecentQueriesComponent extends Component {
  constructor(props) {
    super(props);
    this.state = { search: '' };
  }
  render() {
    const { props, state } = this;
    const onSearchChange = value => {
      this.setState({ search: value });
    }
    const formatCompare = c => c.toLowerCase().replace(/ /g,'').replace(/\n/g,'');
    const compare = formatCompare(state.search);
    const searchResults = props.recentQueries.filter(v => {
      if (!compare) return true;
      if (formatCompare(v.query).indexOf(compare) !== -1) return true;
      return false;
    })
    return (
      <RecentQueries
        {... props}
        onSearchChange={onSearchChange}
        search={state.search}
        searchResults={searchResults}
      />
    )
  }
}

export default RecentQueriesComponent;

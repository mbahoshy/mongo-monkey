import React, { Component } from 'react';
import Json from 'components/json-structure';
import Directory from 'components/create-directory';
import FolderList from 'components/folder-list';

const Files = ({ files, host, activeDb, value }) => {
  const structure = new Directory(files);
  const { root, allFiles } = structure;

  return (
    <FolderList {...root} {...{ host, activeDb, value }} />
  )
}

const Result = ({ data, view, host, activeDb, value}) => {
  if (view === 'files') {
    return (
      <div>
        <Files files={data} {...{ host, activeDb, value }}/>
      </div>
    )
  }

  return (
    <div>
      <Json data={data} padding={10} />
    </div>
  )
}

class ResultsContainer extends Component {
  render () {
    const { results, onSetActiveTab, activeTab, onToggleView, view, host, activeDb, value} = this.props;
    if (!results || results.length < 1) return false;
    const tabs = results.map((v, index) => {
      const className = activeTab === index ? "active" : "";
      const handleSetActiveTab = () => onSetActiveTab(index)
      return (
        <li key={index} onClick={handleSetActiveTab} className={className} role="presentation" >
          <a>{`Results ${index}`}</a>
        </li>
      );
    })
    const activeResult = results[activeTab];
    const handleToggleFiles = () => {
      onToggleView("files");
    }
    const handleToggleJson = () => {
      onToggleView("json");
    }
    const style = {
      color: activeResult.err ? 'red' : 'green',
      opacity: '.75',
      // color: 'rgba(128, 128, 128, 0.71)',
      fontStyle: 'italic',
      fontFamily: 'monospace',
      float: 'left',
      fontWeight: 'bold',
    }
    return (
      <div>
        <ul className="nav nav-tabs">
          {tabs}
        </ul>
        <div className="tab-content">
          <div className="tab-pane active">
            <div className="row">
              <div className="col-lg-12">
                <p style={style}>{activeResult.query}</p>
                <div className="btn-group pull-right" role="group">
                  <button type="button" className="btn btn-default" onClick={handleToggleJson}>
                    <span className="fa fa-code"></span>
                  </button>
                  <button type="button" className="btn btn-default" onClick={handleToggleFiles}>
                    <span className="fa fa-file"></span>
                  </button>
                </div>
              </div>
            </div>
            {activeResult.err && (
              <Result data={activeResult.err} view={view} {...{host, activeDb, value}} />
            )}
            {!activeResult.err && (
              <Result data={activeResult.result} view={view} {...{host, activeDb, value}} />
            )}
          </div>
        </div>
      </div>
    )
  }
}

export default ResultsContainer;

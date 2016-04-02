import React, { Component, PropTypes } from 'react';

const propTypes = {
  dirs: PropTypes.array,
  files: PropTypes.array,
};

class FolderList extends Component {
  constructor(props) {
    super(props);
    this.state = { openFolders: {} };
  }
  toggleFolder(index) {
    const openFolders = Object.assign({}, this.state.openFolders);
    if (openFolders[index] === true) {
      openFolders[index] = false;
    } else {
      openFolders[index] = true;
    }
    this.setState({ openFolders });
  }
  render() {
    const { toggleFolder } = this;
    const { dirs, files, host, activeDb } = this.props;
    const { openFolders } = this.state;
    return (
      <ul style={{ listStyle: 'none' }}>
        {dirs.map((v, index) => {
          const isOpen = openFolders[index] === true;
          const handleToggleFolder = () => toggleFolder.call(this, index);
          if (isOpen) {
            return (
              <li className="open" key={index}>
                <a className="folder" onClick={handleToggleFolder}>
                  <span className="fa fa-folder-open"></span> {v.name}
                </a>
                <FolderList {...v} {...{ host, activeDb }} />
              </li>
            );
          }
          return (
            <li key={index} onClick={handleToggleFolder}>
              <a className="folder"><span className="fa fa-folder"></span> {v.name}</a>
            </li>
          );
        })}
        {files.map((v, index) => {
          return (
            <li key={index}>
              <a target="_blank" href={`/api/files/${encodeURIComponent(host.url)}/${encodeURIComponent(host.port)}/${encodeURIComponent(activeDb)}/${encodeURIComponent(v.getFullName())}`}>
                <span className="fa fa-file-text"></span> {v.name}
              </a>
            </li>
          );
        })}
      </ul>
    );
  }
}

FolderList.propTypes = propTypes;

export default FolderList;

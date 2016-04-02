import React, { Component } from 'react';

export default class DatabaseContainer extends Component {
  render () {
    const { databases, activeDb, onSetActiveDb } = this.props;
    if (!databases) return false;
    return (
      <div>
        <div className="list-group">
          {databases.databases.map((db, index) => {
            return <Database {...{ db, onSetActiveDb, activeDb }} />
          })}
        </div>
      </div>
    )
  }
}

class Database extends Component {
  constructor (props) {
    super(props);
    this.state = { isOpen: false };
  }
  render () {
    const { onSetActiveDb, db, activeDb } = this.props;
    const { isOpen } = this.state;
    const handleSetActive = () => onSetActiveDb(db.name);
    const toggleIsOpen = () => this.setState({ isOpen: !isOpen });
    const className = db.name === activeDb ? "list-group-item active" : "list-group-item"
    return (
      <div className={className}>
        <div>
          <div onClick={handleSetActive} style={{ display: 'inline-block' }}>
            <span className="fa fa-database"></span> {db.name}
          </div>
          <div style={{ display: 'inline-block', padding: '5px' }} onClick={toggleIsOpen} className="pull-right">
            {isOpen === false && <span className="fa fa-caret-left pull-right"></span>}
            {isOpen === true && <span className="fa fa-caret-down pull-right"></span>}
          </div>
        </div>
        {isOpen && (
          <div>
            {db.collections.map((v, index) => {
              return (
                <div key={index}>{v.name}</div>
              )
            })}
          </div>
        )}
      </div>
    )
  }
}

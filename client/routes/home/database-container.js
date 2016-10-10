import React, { Component } from 'react';

export default class DatabaseContainer extends Component {
  render () {
    const { databases, activeDb, onSetActiveDb } = this.props;
    if (!databases) return false;
    return (
      <div style={{ marginTop: '20px', paddingLeft: '10px' }}>
        <span style={{ color: 'green', fontWeight: 'bold', fontSize: '12px' }}>Databases:</span>
        <div>
          {databases.databases.map((db, index) => {
            return <Database {...{ db, onSetActiveDb, activeDb }} />
          })}
        </div>
      </div>
    )
  }
}
const grey = '#696969';


class Database extends Component {
  constructor (props) {
    super(props);
    this.state = { isOpen: false };
  }
  render () {
    const { onSetActiveDb, db, activeDb } = this.props;
    const { isOpen } = this.state;
    const handleSetActive = () => {
      onSetActiveDb(db.name);
    }
    const toggleIsOpen = () => this.setState({ isOpen: !isOpen });
    const isActive = db.name === activeDb;
    const className = isActive ? "dbactive" : "db-style"
    return (
      <div className={className} onClick={toggleIsOpen}>
        <div style={{ backgroundColor: isActive ? 'rgba(234, 234, 234, 0.5)' : 'transparent' }}>
          <div style={{ padding: '10px 0 10px 5px', display: 'inline-block', fontWeight: isActive ? 'bold' : 'normal' }}>
            <span className="fa fa-database"></span> {db.name}
          </div>
          <span style={{ float: 'right' }} className="db-connect" onClick={handleSetActive}>
            <span className="fa fa-bolt"></span>
          </span>
        </div>
        {isOpen && (
          <div style={{ marginTop: '5px', paddingLeft: '5px' }}>
            {db.collections.map((v, index) => {
              return (
                <div key={index} className="collection"><span className="fa fa-table"></span> {v.name}</div>
              )
            })}
          </div>
        )}
      </div>
    )
  }
}

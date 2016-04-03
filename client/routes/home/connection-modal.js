import React, { Component } from 'react';
import Modal from 'components/modal';
import SimpleForm from 'routes/home/connection-form';

class ConnectionModal extends Component {
  constructor (props) {
    super(props);
    this.state = { editing: null, deleting: null }
  }
  render () {
    const { modalOpen, onModalClose, connections, handleSubmit } = this.props;
    const onSetEdit = (index) => {
      this.setState({ editing: index });
    }
    const onSetDelete = (index) => {
      this.setState({ deleting: index });
    }
    const handleAdd = () => {
      this.setState({ editing: 'add' });
    }
    const onConfirmDelete = (index) => {
      const newConnections = Object.assign([], connections);
      newConnections.splice(index, 1);
      handleSubmit(newConnections);
      this.setState({ deleting: null });
    }

    const handleClearDelete = () => onSetDelete(null);

    const handleAddConnection = (connection) => {
      const newConnections = Object.assign([], connections);
      newConnections.push(connection);
      handleSubmit(newConnections);
      this.setState({ editing: null });
    }

    const handleEditConnection = (connection) => {

    }
    const { editing, deleting } = this.state;
    return (
      <div>

        <Modal id="test" isOpen={modalOpen} close={onModalClose}>
          <div className="row connection-header">
            <div className="col-lg-3"><label>Name</label></div>
            <div className="col-lg-6"><label>Host</label></div>
            <div className="col-lg-3"><label>Port</label></div>
          </div>
          {connections.map((v, index) => {
            const handleSetEdit = () => onSetEdit(index);
            const handleDeleteConnection = () => onSetDelete(index);
            const handleConfirmDelete = () => onConfirmDelete(index);

            if (editing === index) {
              return (
                <div className="row connection-row">
                  <SimpleForm initialValues={v} />
                </div>
              );
            }
            if (deleting === index) {
              return (
                <div className="row connection-row" style={{ backgroundColor: 'red', color: 'white' }}>
                  <div className="col-lg-12">
                    <span style={{ color: 'white', fontWeight: 'bold' }}>Are you sure?</span>
                    <div className="pull-right">
                      <span className="fa fa-check connection-button" onClick={handleConfirmDelete}></span>
                      <span className="fa fa-remove connection-button" onClick={handleClearDelete}></span>
                    </div>
                  </div>
                </div>
              )
            }
            return (
              <div className="row connection-row">
                <div className="col-lg-3">{v.name}</div>
                <div className="col-lg-6">{v.url}</div>
                <div className="col-lg-3">{v.port}
                  <div className="pull-right">
                    <span className="fa fa-pencil connection-button" onClick={handleSetEdit}></span>
                    <span className="fa fa-trash connection-button" onClick={handleDeleteConnection}></span>
                  </div>
                </div>
              </div>
            );
          })}
          <div className="row">
            <div className="col-lg-12">
              <div onClick={handleAdd}><span className="fa fa-plus"></span> Connection</div>
            </div>
          </div>
          {(editing === 'add') && (
            <div>
              <SimpleForm initialValues={{}} {...{ onSubmit: handleAddConnection }} />
            </div>
          )}
        </Modal>
      </div>
    )
  }
}

export default ConnectionModal;

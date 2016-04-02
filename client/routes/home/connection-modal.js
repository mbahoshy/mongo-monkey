import React, { Component } from 'react';
import Modal from 'components/modal';
import SimpleForm from 'routes/home/connection-form';

class ConnectionModal extends Component {
  constructor (props) {
    super(props);
    this.state = { editing: null }
  }
  render () {
    const { modalOpen, onModalClose, connections, handleSubmit } = this.props;
    const onSetEdit = (index) => {
      this.setState({ editing: index });
    }
    const handleAdd = () => {
      this.setState({ editing: 'add' });
    }

    const handleAddConnection = (connection) => {
      const newConnections = Object.assign([], connections);
      newConnections.push(connection);
      handleSubmit(newConnections);
      this.setState({ editing: null });
    }

    const handleEditConnection = (connection) => {
      
    }
    const { editing } = this.state;
    return (
      <div>

        <Modal id="test" isOpen={modalOpen} close={onModalClose}>
          <div className="row">
            <div className="col-lg-3"><label>Name</label></div>
            <div className="col-lg-6"><label>Host</label></div>
            <div className="col-lg-3"><label>Port</label></div>
          </div>
          {connections.map((v, index) => {
            const handleSetEdit = () => onSetEdit(index);
            if (editing === index) {
              return <SimpleForm initialValues={v} />;
            }
            return (
              <div className="row">
                <div className="col-lg-3">{v.name}</div>
                <div className="col-lg-6">{v.url}</div>
                <div className="col-lg-3">{v.port}
                  <div className="pull-right">
                    <span className="fa fa-pencil" onClick={handleSetEdit}></span>
                    <span className="fa fa-trash" onClick={handleSetEdit}></span>
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

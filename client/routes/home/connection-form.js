import React, { Component } from 'react';

import {reduxForm} from 'redux-form';
export const fields = [
  'name',
  'url',
  'port',
];

class SimpleForm extends Component {

  render() {
    const {
      fields: {name, url, port},
      handleSubmit,
      resetForm,
      submitting,
      handleCancelEdit,
      } = this.props;
    return (
      <form onSubmit={handleSubmit}>
        <div className="col-lg-3">
          <div>
            <input className="form-control" type="text" placeholder="Name" {...name}/>
          </div>
        </div>
        <div className="col-lg-6">
          <div>
            <input className="form-control" type="text" placeholder="Url" {...url}/>
          </div>
        </div>
        <div className="col-lg-3">
          <div className="input-group">
            <input className="form-control" aria-describedby="conninput" type="text" placeholder="Port" {...port} style={{ borderRadius: '4px' }}/>
            <span className="input-group-addon" id="conninput">
              <span className="fa fa-check connection-button" onClick={handleSubmit}></span>
              <span className="fa fa-ban connection-button" onClick={handleCancelEdit}></span>
            </span>
          </div>
        </div>
        {/*
        <div>
          <button type="submit" disabled={submitting}>
            {submitting ? <i/> : <i/>} Submit
          </button>
          <button type="button" disabled={submitting} onClick={resetForm}>
            Clear Values
          </button>
        </div>
        */}
      </form>
    );
  }
}

export default reduxForm({
  form: 'simple',
  fields
})(SimpleForm);

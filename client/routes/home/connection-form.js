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
      submitting
      } = this.props;
    return (
      <form onSubmit={handleSubmit}>
        <div className="row">
          <div className="col-lg-3">
            <div className="form-group">
              <div>
                <input className="form-control" type="text" placeholder="Name" {...name}/>
              </div>
            </div>
          </div>
          <div className="col-lg-6">
            <div className="form-group">
              <div>
                <input className="form-control" type="text" placeholder="Url" {...url}/>
              </div>
            </div>
          </div>
          <div className="col-lg-3">
            <div className="form-group">
              <div>
                <input className="form-control" type="text" placeholder="Port" {...port}/>
              </div>
            </div>
          </div>
          <div>
            <button type="submit" disabled={submitting}>
              {submitting ? <i/> : <i/>} Submit
            </button>
            <button type="button" disabled={submitting} onClick={resetForm}>
              Clear Values
            </button>
          </div>
        </div>
      </form>
    );
  }
}

export default reduxForm({
  form: 'simple',
  fields
})(SimpleForm);

import React from 'react';

const selectStyle = {
  border: 'none',
  float: 'left',
  width: '100%',
  backgroundColor: 'transparent',
  borderBottom: '1px solid #CCC',
  WebkitAppearance: 'none',
  MozAppearance: 'none',
  borderRadius: '0',
  boxShadow: 'none',
  height: '40px',
  padding: '0 10px',
};

const buttonStyle = {
  position: 'absolute',
  top: '5px',
  right: '0',
  padding: '10px',
};

const SelectHost = props => {
  const {
    handleHostChange,
    connections,
    handleConnectDatabase,
  } = props;
  return (
    <div style={{ position: 'relative', height: '40px' }}>
      <select onChange={handleHostChange} style={selectStyle} >
        <option>Select host</option>
        {connections.map((option, index) => {
          return (
            <option value={index} key={index}>
              {option.name}
            </option>
          )
        })}
      </select>
      <span style={buttonStyle} onClick={handleConnectDatabase}>
        <span className="fa fa-rocket"></span>
      </span>
    </div>
  )
}

export default SelectHost;


/*

<div className="input-group">
  <select className="form-control" aria-describedby="dbinput" onChange={handleHostChange} >
    <option>Select host</option>
    {connections.map((option, index) => {
      return (
        <option value={index} key={index}>
          {`${option.name} - ${option.url}:${option.port}`}
        </option>
      )
    })}
  </select>
  <span className="input-group-addon" id="dbinput" onClick={handleConnectDatabase}>
    <span className="fa fa-rocket"></span>
  </span>
</div>

*/

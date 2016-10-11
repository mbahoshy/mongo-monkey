import React from 'react';

const ActiveHost = props => {
  const { activeHost, activeDb } = props;

  if (!activeHost) return <div></div>;

  const { name, port, url } = activeHost;

  const line = activeDb ? `${url}:${port}/${activeDb}` : `${url}:${port}`;

  return (
    <div style={{ marginTop: '10px', fontSize: '12px', backgroundColor: 'rgba(234, 234, 234, 0.5)', padding: '10px' }}>
      <span style={{ color: 'green', fontWeight: 'bold' }}>Connection Information:</span>
      <div style={{ paddingLeft: '5px'}}>
        <i>{name}</i>
        <br />
        {line}
      </div>
    </div>
  )
}

export default ActiveHost;

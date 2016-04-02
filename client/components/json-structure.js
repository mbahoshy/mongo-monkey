import React, {PropType, Component} from 'react'

class JsonArray extends Component {
  constructor (props) {
    super(props);
    this.state = { isOpen: true }
  }
  render () {
    const { data, padding } = this.props;
    const { isOpen } = this.state;
    const style = { marginLeft: `${padding}px` }
    const toggleOpen = () => {
      this.setState({ isOpen: true })
    }
    const toggleClose = () => {
      this.setState({ isOpen: false })
    }
    if (isOpen === false) {
      return (
        <div style={style}>
          <span onClick={toggleOpen} className="fa fa-caret-right"></span>
          {` [...]`}
        </div>
      )
    }

    const html = data.map((v, index) => {
      return (
        <div style={style} key={index}>
          <span style={{ color: 'blue' }}>{index}</span>:
          <Json data={v} padding={padding} />
        </div>
      );
    })

    return (
      <div style={style}>
        <span onClick={toggleClose} className="fa fa-caret-down"></span>
        {` [`}
        {html}
        {`]`}
      </div>
    );
  }
}

class JsonObject extends Component {
  constructor (props) {
    super(props);
    this.state = { isOpen: true };
  }
  render() {
    const { data, padding } = this.props;
    const { isOpen } = this.state;
    const keys = Object.keys(data);
    const style = { marginLeft: `${padding}px` }
    const toggleOpen = () => {
      this.setState({ isOpen: true })
    }
    const toggleClose = () => {
      this.setState({ isOpen: false })
    }
    if (isOpen === false) {
      return (
        <div style={Object.assign({}, style, {display: 'inline'})}>
          <span onClick={toggleOpen} className="fa fa-caret-right"></span>
          {` {...}`}
        </div>
      )
    }

    const html = keys.map((v, index) => {
      return (
        <div style={style} key={index}>
          <span style={{ color: 'purple'}}>{v}</span>:
          <Json data={data[v]} padding={padding} />
        </div>
      )
    })
    return (
      <div style={Object.assign({}, style, {display: 'inline'})}>
        <span onClick={toggleClose} className="fa fa-caret-down"></span>
        {` {`}
        {html}
        {`}`}
      </div>
    )
  }
}

const JsonData = ({ data }) => {
  if (data === null || data === undefined) {
    return (<span>{` null`}</span>)
  }
  var datatype = typeof(data);
  if (datatype === 'string') {
    return (<span>{` "${data}"`}</span>);
  }
  return (<span>{` ${data}`}</span>);
}

const Json = ({ data, padding }) => {
  if (data === null || data === undefined) {
    return (<span>{` null`}</span>)
  }
  if (Array.isArray(data)) {
    return (
      <JsonArray
        {...{
          data,
          padding: padding,
        }}
      />
    );
  }
  if (typeof(data) === 'object') {
    return (
      <JsonObject
        {...{
          data,
          padding: padding,
        }}
      />
    );
  }

  return <JsonData data={data} />
}



export default Json;

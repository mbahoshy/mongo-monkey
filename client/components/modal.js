import React, { PropTypes, Component } from 'react';
import ReactDOM from 'react-dom';

const propTypes = {
  close: PropTypes.func.isRequired,   // fired when close event is triggered
  id: PropTypes.string.isRequired,    // id of the modal appended to dom
  isOpen: PropTypes.bool.isRequired,  // is the modal currently open
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
};

export const ModalComponent = (props) => {
  const { close, children, isOpen } = props;
  const transitionProps = {
    component: false,
    enter: { opacity: 1 },
    leave: { opacity: 0 },
  };

  const innerHtml = (
    <div {...props} className={'reveal-modal'}>
      <div className="reveal-overlay" onClick={close}></div>
      <div className="reveal">
        {children}
        <button className="close-button" type="button" onClick={close}>
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
    </div>
  );

  return (
    <div>{isOpen && innerHtml}</div>
  );

};

class Modal extends Component {
  constructor(props) {
    super(props);
    this.portalElement = null;
  }
  componentDidMount() {
    const elem = this.getElement(this.props.id);
    this.portalElement = elem;
    this.componentDidUpdate();
  }
  componentDidUpdate() {
    ReactDOM.render(this.getHtml(), this.portalElement);
  }
  componentWillUnmount() {
    document.body.removeChild(this.portalElement);
  }
  getElement(id) {
    let elem = document.getElementById(id);
    if (elem) return elem;

    elem = document.createElement('div');
    elem.id = id;
    document.body.appendChild(elem);

    return elem;
  }
  getHtml() {
    return <ModalComponent {...this.props} />;
  }
  render() {
    return false;
  }
}

Modal.propTypes = propTypes;
ModalComponent.propTypes = propTypes;
export default ModalComponent;

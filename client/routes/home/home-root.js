import React, {PropType, Component} from 'react'
import { connect } from 'react-redux';
import { sendQuery, setActiveTab, getDatabases, setActiveDb, setConnections, getConnections } from 'actions/actions-home';
import Json from 'components/json-structure';
import ResultsContainer from 'routes/home/results-container';
import DatabaseContainer from 'routes/home/database-container';
import ConnectionModal from 'routes/home/connection-modal';
import Search from 'routes/home/search';
import MonkeySrc from 'imgs/monkey.png';
import DancingSrc from 'imgs/dancing_banana.gif';
import LoadingSrc from 'imgs/loading.gif';

class Home extends Component {
	constructor(props) {
		super(props)
    this.state = { value: '', host: null , view: "json", modalOpen: false}
	}
  componentDidMount () {
    this.props.onGetConnections();
  }
	render() {
    const { value, host, view, modalOpen } = this.state;
    const {
      results,
      onSetActiveTab,
      activeTab,
      activeDb,
      databases,
      onSetActiveDb,
      onSetConnections,
      queryLoading,
      dbLoading,
      connections } = this.props;

    const handleOnChange = (value) => this.setState({ value });

    const handleSendQuery = () => {
      this.props.onSendQuery(host, activeDb, value);
    }

    const handleHostChange = (e) => {
      const { value } = e.target;
      const connection = connections[value]
      this.setState({ host: connection })
    }

    const handleConnectDatabase = () => {
      this.props.onGetDatabases(host);
    }

    const onToggleView = (view) => {
      this.setState({ view });
    }

    const onModalOpen = () => {
      this.setState({ modalOpen: true });
    }

    const onModalClose = () => {
      this.setState({ modalOpen: false });
    }

    const handleSubmit = (values) => onSetConnections(values);

    const style = {
      marginTop: '30px',
      color: 'blue',
    }

    const currentDb = databases ? databases.databases.find(x => x.name === activeDb) : null;
		return (
			<div className="container-fluid">
        <div className="row">
          <div className="app-header">
            <div className="col-lg-12">
              <img className="logo" src={MonkeySrc} />
              <h2 className="pull-left">MongoMonkey</h2>
              <span className="pull-right" style={style} onClick={onModalOpen}>Manage Connections</span>
            </div>
          </div>
        </div>

        <ConnectionModal {... { modalOpen, onModalClose, connections, handleSubmit }} />

        <div className="col-lg-3">
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
          {dbLoading && (
            <div className="loading-db">
              <img src={LoadingSrc} />
            </div>
          )}
          {!dbLoading && (
            <DatabaseContainer {...{ databases, activeDb, onSetActiveDb }} />
          )}
        </div>
        <div className="col-lg-9">
          <Search {... { handleOnChange, value, handleSendQuery, currentDb }} />
          <br />
          {queryLoading && (
            <div className="loading-banana">
              <img src={LoadingSrc} />
              {/* <div>Loading ...</div> */}
            </div>
          )}
          {!queryLoading && (
            <ResultsContainer {...{ results, onSetActiveTab, activeTab, onToggleView, view, host, activeDb, value}} />
          )}
        </div>
			</div>
		)
	}
}


const mapState = state => ({
  results: state.appStore.results,
  activeTab: state.appStore.activeTab,
  databases: state.appStore.databases,
  activeDb: state.appStore.activeDb,
  connections: state.appStore.connections,
  queryLoading: state.loadingStore.loading.queryLoading,
  dbLoading: state.loadingStore.loading.dbLoading,
});
const mapDispatch = dispatch => ({
  onSendQuery: (host, activeDb, query) => dispatch(sendQuery(host, activeDb, query)),
  onSetActiveTab: (value) => dispatch(setActiveTab(value)),
  onGetDatabases: (value) => dispatch(getDatabases(value)),
  onSetActiveDb: (value) => dispatch(setActiveDb(value)),
  onSetConnections: (value) => dispatch(setConnections(value)),
  onGetConnections: (value) => dispatch(getConnections(value)),
});

export default connect(mapState, mapDispatch)(Home);

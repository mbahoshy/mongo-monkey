import React, {PropType, Component} from 'react'
import { connect } from 'react-redux';
import { sendQuery, setActiveTab, getDatabases, setActiveDb, setConnections, getConnections, getRecentQueries, toggleRecentQueries } from 'actions/actions-home';
import Json from 'components/json-structure';
import ResultsContainer from 'routes/home/results-container';
import DatabaseContainer from 'routes/home/database-container';
import ConnectionModal from 'routes/home/connection-modal';
import Search from 'routes/home/search';
import RecentQueries from 'routes/home/recent-queries';
import SelectHost from 'routes/home/select-host';
import ActiveHost from 'routes/home/active-host';

import MonkeySrc from 'imgs/monkey.png';
import DancingSrc from 'imgs/dancing_banana.gif';
import LoadingSrc from 'imgs/loading.gif';

class Home extends Component {
	constructor(props) {
		super(props)
    this.props.onGetConnections();
    this.props.onGetRecentQueries();
    this.state = { value: '', host: null , view: "json", modalOpen: false}
	}
  componentDidMount () {

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
      resultKey,
      recentQueries,
      onToggleRecentQueries,
      showRecentQueries,
      activeHost,
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
      color: 'whitesmoke',
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
          <SelectHost {... {
              handleHostChange,
              connections,
              handleConnectDatabase,
            }}
          />
          {dbLoading && (
            <div className="loading-db">
              <img src={LoadingSrc} />
            </div>
          )}
          {!dbLoading && (
            <div>
              <ActiveHost {...{ activeHost, activeDb }} />
              <DatabaseContainer {...{ databases, activeDb, onSetActiveDb }} />
            </div>
          )}
        </div>
        <div className="col-lg-9">
          <Search {... { handleOnChange, value, handleSendQuery, currentDb }} />
          <RecentQueries {...{ recentQueries, handleOnChange, onToggleRecentQueries, showRecentQueries }} />

          <br />
          {queryLoading && (
            <div className="loading-banana">
              <img src={LoadingSrc} />
              {/* <div>Loading ...</div> */}
            </div>
          )}
          {!queryLoading && (
            <ResultsContainer {...{ results, onSetActiveTab, activeTab, onToggleView, view, host, activeDb, value, resultKey}} />
          )}
        </div>
			</div>
		)
	}
}


const mapState = state => {
  return {
  results: state.appStore.results,
  activeTab: state.appStore.activeTab,
  databases: state.appStore.databases,
  activeDb: state.appStore.activeDb,
  connections: state.appStore.connections,
  recentQueries: state.appStore.recentQueries,
  queryLoading: state.loadingStore.loading.queryLoading,
  dbLoading: state.loadingStore.loading.dbLoading,
  resultKey: state.appStore.resultKey,
  showRecentQueries: state.appStore.showRecentQueries,
  activeHost: state.appStore.activeHost,
  }
};
const mapDispatch = dispatch => ({
  onSendQuery: (host, activeDb, query) => dispatch(sendQuery(host, activeDb, query)),
  onSetActiveTab: (value) => dispatch(setActiveTab(value)),
  onGetDatabases: (value) => dispatch(getDatabases(value)),
  onSetActiveDb: (value) => dispatch(setActiveDb(value)),
  onSetConnections: (value) => dispatch(setConnections(value)),
  onGetConnections: (value) => dispatch(getConnections(value)),
  onGetRecentQueries: (value) => dispatch(getRecentQueries(value)),
  onToggleRecentQueries: () => dispatch(toggleRecentQueries()),
});

export default connect(mapState, mapDispatch)(Home);

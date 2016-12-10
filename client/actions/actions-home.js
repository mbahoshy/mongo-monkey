import { post } from 'utils/api';

export const POST_QUERY_SUBMIT = "POST_QUERY_SUBMIT";
export const POST_QUERY_SUCCESS = "POST_QUERY_SUCCESS";
export const POST_QUERY_FAIL = "POST_QUERY_FAIL";

export const POST_HOST_SUBMIT = "POST_HOST_SUBMIT";
export const POST_HOST_SUCCESS = "POST_HOST_SUCCESS";
export const POST_HOST_FAIL = "POST_HOST_FAIL";

export const SET_ACTIVE_TAB = "SET_ACTIVE_TAB";
export const SET_ACTIVE_DB = "SET_ACTIVE_DB";

export const SET_CONNECTIONS = "SET_CONNECTIONS";
export const GET_CONNECTIONS = "GET_CONNECTIONS";

export const SET_RECENT_QUERIES = "SET_RECENT_QUERIES";
export const TOGGLE_RECENT_QUERIES = "TOGGLE_RECENT_QUERIES";

const QUERY_LIMIT = 20;

const getQueries = () => {
  const storedQueries = localStorage.getItem('recentQueries');
  const recentQueries = JSON.parse(storedQueries) || [];
  return recentQueries.slice(0, QUERY_LIMIT)
}

const saveRecentQuery = ({ host, activeDb, query }) => {
  const recentQueries = getQueries();
  recentQueries.unshift({
    host,
    activeDb,
    query,
    timestamp: new Date().getTime(),
  });
  localStorage.setItem('recentQueries', JSON.stringify(recentQueries.slice(0, QUERY_LIMIT)));
  return recentQueries;
}

export function sendQuery (host, activeDb, query) {
	return (dispatch) => {
		dispatch({type: POST_QUERY_SUBMIT});
		return post('/api/query', { host, activeDb, query }, null, (err, result) => {
      if (err) {
        return dispatch({type: POST_QUERY_FAIL, err});
      }
      const recentQueries = saveRecentQuery({ host, activeDb, query });
      dispatch({type: SET_RECENT_QUERIES, payload: recentQueries });
			return dispatch({type: POST_QUERY_SUCCESS, payload: result });
		})
	}
}

export function setActiveTab (value) {
  return {type: SET_ACTIVE_TAB, payload: value};
}

export function setActiveDb (value) {
  return {type: SET_ACTIVE_DB, payload: value};
}

export function setConnections (connections) {
  localStorage.setItem('connections', JSON.stringify(connections));
  return { type: SET_CONNECTIONS, payload: connections };
}

export function getConnections () {
  const connections = localStorage.getItem('connections');
  return { type: GET_CONNECTIONS, payload: JSON.parse(connections) || [] };
}

export function getRecentQueries () {
  const recentQueries = getQueries();
  return { type: SET_RECENT_QUERIES, payload: recentQueries };
}

export function toggleRecentQueries () {
  return { type: TOGGLE_RECENT_QUERIES };
}

export function getDatabases (host) {
	return (dispatch) => {
		dispatch({type: POST_HOST_SUBMIT});
		return post('/api/databases', host, null, (err, result) => {
      if (err) {
        return dispatch({type: POST_HOST_FAIL, err});
      }
			return dispatch({type: POST_HOST_SUCCESS, payload: { host, databases: result }});
		})
	}
}

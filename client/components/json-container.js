import React, { Component } from 'react';
import Json from 'components/json-structure';

const getStart = (numPages, currentPage, pageLimit) => {
  if (numPages > pageLimit) {
    const half = Math.floor(pageLimit / 2);
    const start = currentPage - half;
    if (start <= 0) return 1;
    return start;
  }
  return 0;
};

const getEnd = (numPages, currentPage, pageLimit, start) => {
  if (numPages > pageLimit) {
    if (start === 0) return pageLimit;
    let end = start + pageLimit;
    end = end > (numPages - 1) ? numPages - 1 : end;
    return end;
  }

  return numPages;
};

const setPageClick = (onPageClick, value, ignore) => {
  if (ignore) return null;
  return () => onPageClick(value);
};

const getPages = (numPages, currentPage, onPageClick, pageLimit) => {
  const pages = [];

  let start = getStart(numPages, currentPage, pageLimit);
  const end = getEnd(numPages, currentPage, pageLimit, start);

  if (end - start < pageLimit && numPages > pageLimit) {
    start = end - pageLimit;
  }

  if (start !== 0) {
    const className = currentPage === 0 ? "page active-page" : "page";
    pages.push(
      <span key={0} className={className}>
        {currentPage !== 0 && <span onClick={setPageClick(onPageClick, 0)}>1</span>}
        {currentPage === 0 && <span>1</span>}
      </span>
    );
  }

  if (start >= 2) {
    pages.push(
      <span className="page">
        <span key="ellip-1" className="fa fa-ellipsis-h"></span>
      </span>
    );
  }

  for (let i = start; i < end; i++) {
    const className = currentPage === i ? "page active-page" : "page";
    pages.push(
      <span key={i} className={className}>
        {currentPage !== i && <span onClick={setPageClick(onPageClick, i)}>{i + 1}</span>}
        {currentPage === i && <span>{i + 1}</span>}
      </span>
    );
  }

  if (end < (numPages - 1)) {
    pages.push(
      <span className="page">
        <span key="ellip-2" className="fa fa-ellipsis-h"></span>
      </span>
    );
  }

  if (end !== numPages) {
    const className = currentPage === (numPages - 1) ? "page active-page" : "page";
    pages.push(
      <span key={numPages - 1} className={className}>
        {currentPage !== numPages - 1 &&
          <span onClick={setPageClick(onPageClick, numPages - 1)}>{numPages}</span>}
        {currentPage === numPages - 1 && <span>{numPages}</span>}
      </span>
    );
  }
  return pages;
};

class JsonContainer extends Component {
  constructor (props) {
    super(props);
    this.state = { currentPage: 0 };
  }
  getPager(numPages, currentPage) {
    const pages = [];
    for (let i = 0; i < numPages; i++) {
      const handleSetCurrentPage = () => {
        this.setState({ currentPage: i });
      }
      const className = currentPage === i ? "page active-page" : "page";
      pages.push(<span key={i} className={className} onClick={handleSetCurrentPage}>{i + 1}</span>);
    }
    return (
      <div>
        {pages}
      </div>
    )
  }
  render () {
    const { data } = this.props;
    const maxRows = 10;
    const maxPages = 8;
    const { currentPage } = this.state;
    let displayData = data;
    if (data.length > maxRows) {
      const copiedData = Object.assign([], data);
      displayData = copiedData.splice(maxRows * currentPage, maxRows);
    }
    const numPages = Math.ceil(data.length / maxRows);
    const onPageClick = (index) => {
      this.setState({ currentPage: index });
    }
    const pagination = (
      <div className="row">
        <div className="col-lg-12">
          <div className="json-pagination">
            <span className="page" onClick={setPageClick(onPageClick, currentPage - 1, currentPage === 0)}>
                <span className="fa fa-backward"></span>
            </span>
            {getPages(numPages, currentPage, onPageClick, maxPages)}
            <span className="page" onClick={setPageClick(onPageClick, currentPage + 1, currentPage === (numPages - 1))}>
              <span className="fa fa-forward"></span>
            </span>
          </div>
        </div>
      </div>
    )
    return (
      <div>
        {pagination}
        <Json data={displayData} padding={10} start={maxRows * currentPage} />
        {pagination}
      </div>
    )
  }
}

export default JsonContainer;

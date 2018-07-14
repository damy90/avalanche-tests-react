import React from 'react';
import InfiniteScroll from 'react-infinite-scroller';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Col, Row, Table } from 'reactstrap';
// tslint:disable-next-line:no-unused-variable
import { ICrudGetAllAction, TextFormat, getSortState, IPaginationBaseState } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { IRootState } from 'app/shared/reducers';
import { getEntities, reset } from './avalanche-test.reducer';
import { IAvalancheTest } from 'app/shared/model/avalanche-test.model';
// tslint:disable-next-line:no-unused-variable
import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants';
import { ITEMS_PER_PAGE } from 'app/shared/util/pagination.constants';

export interface IAvalancheTestProps extends StateProps, DispatchProps, RouteComponentProps<{ url: string }> {}

export type IAvalancheTestState = IPaginationBaseState;

export class AvalancheTest extends React.Component<IAvalancheTestProps, IAvalancheTestState> {
  state: IAvalancheTestState = {
    ...getSortState(this.props.location, ITEMS_PER_PAGE)
  };

  componentDidMount() {
    this.reset();
  }

  reset = () => {
    this.setState({ activePage: 0 }, () => {
      this.props.reset();
      this.getEntities();
    });
  };

  handleLoadMore = () => {
    if (window.pageYOffset > 0) {
      this.setState({ activePage: this.state.activePage + 1 }, () => this.getEntities());
    }
  };

  sort = prop => () => {
    this.setState(
      {
        activePage: 0,
        order: this.state.order === 'asc' ? 'desc' : 'asc',
        sort: prop
      },
      () => this.reset()
    );
  };

  getEntities = () => {
    const { activePage, itemsPerPage, sort, order } = this.state;
    this.props.getEntities(activePage, itemsPerPage, `${sort},${order}`);
  };

  render() {
    const { avalancheTestList, match } = this.props;
    return (
      <div>
        <h2 id="avalanche-test-heading">
          Avalanche Tests
          <Link to={`${match.url}/new`} className="btn btn-primary float-right jh-create-entity" id="jh-create-entity">
            <FontAwesomeIcon icon="plus" />&nbsp; Create new Avalanche Test
          </Link>
        </h2>
        <div className="table-responsive">
          <InfiniteScroll
            pageStart={this.state.activePage}
            loadMore={this.handleLoadMore}
            hasMore={this.state.activePage < this.props.links.next}
            loader={<div className="loader">Loading ...</div>}
            threshold={0}
            initialLoad={false}
          >
            <Table responsive>
              <thead>
                <tr>
                  <th className="hand" onClick={this.sort('id')}>
                    ID <FontAwesomeIcon icon="sort" />
                  </th>
                  <th className="hand" onClick={this.sort('lon')}>
                    Lon <FontAwesomeIcon icon="sort" />
                  </th>
                  <th className="hand" onClick={this.sort('lat')}>
                    Lat <FontAwesomeIcon icon="sort" />
                  </th>
                  <th className="hand" onClick={this.sort('place')}>
                    Place <FontAwesomeIcon icon="sort" />
                  </th>
                  <th className="hand" onClick={this.sort('dangerLevel')}>
                    Danger Level <FontAwesomeIcon icon="sort" />
                  </th>
                  <th className="hand" onClick={this.sort('content')}>
                    Content <FontAwesomeIcon icon="sort" />
                  </th>
                  <th className="hand" onClick={this.sort('user')}>
                    User <FontAwesomeIcon icon="sort" />
                  </th>
                  <th className="hand" onClick={this.sort('dateCreated')}>
                    Date Created <FontAwesomeIcon icon="sort" />
                  </th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {avalancheTestList.map((avalancheTest, i) => (
                  <tr key={`entity-${i}`}>
                    <td>
                      <Button tag={Link} to={`${match.url}/${avalancheTest.id}`} color="link" size="sm">
                        {avalancheTest.id}
                      </Button>
                    </td>
                    <td>{avalancheTest.lon}</td>
                    <td>{avalancheTest.lat}</td>
                    <td>{avalancheTest.place}</td>
                    <td>{avalancheTest.dangerLevel}</td>
                    <td>{avalancheTest.content}</td>
                    <td>{avalancheTest.user}</td>
                    <td>
                      <TextFormat type="date" value={avalancheTest.dateCreated} format={APP_DATE_FORMAT} />
                    </td>
                    <td className="text-right">
                      <div className="btn-group flex-btn-group-container">
                        <Button tag={Link} to={`${match.url}/${avalancheTest.id}`} color="info" size="sm">
                          <FontAwesomeIcon icon="eye" /> <span className="d-none d-md-inline">View</span>
                        </Button>
                        <Button tag={Link} to={`${match.url}/${avalancheTest.id}/edit`} color="primary" size="sm">
                          <FontAwesomeIcon icon="pencil-alt" /> <span className="d-none d-md-inline">Edit</span>
                        </Button>
                        <Button tag={Link} to={`${match.url}/${avalancheTest.id}/delete`} color="danger" size="sm">
                          <FontAwesomeIcon icon="trash" /> <span className="d-none d-md-inline">Delete</span>
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </InfiniteScroll>
        </div>
      </div>
    );
  }
}

const mapStateToProps = ({ avalancheTest }: IRootState) => ({
  avalancheTestList: avalancheTest.entities,
  totalItems: avalancheTest.totalItems,
  links: avalancheTest.links
});

const mapDispatchToProps = {
  getEntities,
  reset
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AvalancheTest);

import './home.css';

import React from 'react';
import { Link } from 'react-router-dom';

import { connect } from 'react-redux';
import { Row, Col, Alert } from 'reactstrap';

import { IRootState } from 'app/shared/reducers';
import { getSession } from 'app/shared/reducers/authentication';
import TestsMap from './../../shared/map/map';
import $ from 'jquery';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export interface IHomeProp extends StateProps, DispatchProps {}

export class Home extends React.Component<IHomeProp> {
  map: {};

  constructor(props) {
    super(props);

    this.state = {
      testsData: []
    };

    this.onData = this.onData.bind(this);
  }
  componentDidMount() {
    this.props.getSession();
    $.getJSON('/api/avalanche-tests', null, this.onData);
  }

  onData(testsData) {
    if (this.map) {
      this.map.onData(testsData);
    }
  }

  render() {
    const { account } = this.props;
    return (
      <Row>
        <Col md="12">
          <h2>Crowd sourced avalaunche buletin</h2>
          <p className="lead">
            The information is maintained by volunteers. It is not an official avalaunche buletin. Please check the official avalaunche
            buletin for your resort if there is one.
          </p>
          {account && account.login ? (
            <div>
              <Alert color="success">
                You are logged in as user {account.login}.
                <Link to={`/entity/avalanche-test/new`} className="btn btn-primary float-right jh-create-entity" id="jh-create-entity">
                  <FontAwesomeIcon icon="plus" />&nbsp; Create new Avalanche Test
                </Link>
              </Alert>
            </div>
          ) : (
            <div>
              <Alert color="warning">
                If you want to
                <Link to="/login" className="alert-link">
                  {' '}
                  sign in
                </Link>
                , you can try the default accounts:
                <br />- Administrator (login=&quot;admin&quot; and password=&quot;admin&quot;)
                <br />- User (login=&quot;user&quot; and password=&quot;user&quot;).
              </Alert>

              <Alert color="warning">
                You do not have an account yet?&nbsp;
                <Link to="/register" className="alert-link">
                  Register a new account
                </Link>
              </Alert>
            </div>
          )}
          <TestsMap
            ref={instance => {
              this.map = instance;
            }}
          />
        </Col>
      </Row>
    );
  }
}

const mapStateToProps = storeState => ({
  account: storeState.authentication.account,
  isAuthenticated: storeState.authentication.isAuthenticated
});

const mapDispatchToProps = { getSession };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Home);

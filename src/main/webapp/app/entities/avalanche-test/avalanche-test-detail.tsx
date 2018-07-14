import React from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col } from 'reactstrap';
// tslint:disable-next-line:no-unused-variable
import { ICrudGetAction, TextFormat } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { IRootState } from 'app/shared/reducers';
import { getEntity } from './avalanche-test.reducer';
import { IAvalancheTest } from 'app/shared/model/avalanche-test.model';
// tslint:disable-next-line:no-unused-variable
import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants';

export interface IAvalancheTestDetailProps extends StateProps, DispatchProps, RouteComponentProps<{ id: number }> {}

export class AvalancheTestDetail extends React.Component<IAvalancheTestDetailProps> {
  componentDidMount() {
    this.props.getEntity(this.props.match.params.id);
  }

  render() {
    const { avalancheTestEntity } = this.props;
    return (
      <Row>
        <Col md="8">
          <h2>
            AvalancheTest [<b>{avalancheTestEntity.id}</b>]
          </h2>
          <dl className="jh-entity-details">
            <dt>
              <span id="lon">Lon</span>
            </dt>
            <dd>{avalancheTestEntity.lon}</dd>
            <dt>
              <span id="lat">Lat</span>
            </dt>
            <dd>{avalancheTestEntity.lat}</dd>
            <dt>
              <span id="place">Place</span>
            </dt>
            <dd>{avalancheTestEntity.place}</dd>
            <dt>
              <span id="dangerLevel">Danger Level</span>
            </dt>
            <dd>{avalancheTestEntity.dangerLevel}</dd>
            <dt>
              <span id="content">Content</span>
            </dt>
            <dd>{avalancheTestEntity.content}</dd>
            <dt>
              <span id="user">User</span>
            </dt>
            <dd>{avalancheTestEntity.user}</dd>
            <dt>
              <span id="dateCreated">Date Created</span>
            </dt>
            <dd>
              <TextFormat value={avalancheTestEntity.dateCreated} type="date" format={APP_DATE_FORMAT} />
            </dd>
          </dl>
          <Button tag={Link} to="/entity/avalanche-test" replace color="info">
            <FontAwesomeIcon icon="arrow-left" /> <span className="d-none d-md-inline">Back</span>
          </Button>&nbsp;
          <Button tag={Link} to={`/entity/avalanche-test/${avalancheTestEntity.id}/edit`} replace color="primary">
            <FontAwesomeIcon icon="pencil-alt" /> <span className="d-none d-md-inline">Edit</span>
          </Button>
        </Col>
      </Row>
    );
  }
}

const mapStateToProps = ({ avalancheTest }: IRootState) => ({
  avalancheTestEntity: avalancheTest.entity
});

const mapDispatchToProps = { getEntity };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AvalancheTestDetail);

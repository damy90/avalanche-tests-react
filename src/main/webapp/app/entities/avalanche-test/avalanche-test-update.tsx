import React from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col, Label } from 'reactstrap';
import { AvForm, AvGroup, AvInput, AvField } from 'availity-reactstrap-validation';
// tslint:disable-next-line:no-unused-variable
import { ICrudGetAction, ICrudGetAllAction, ICrudPutAction } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IRootState } from 'app/shared/reducers';

import { getEntity, updateEntity, createEntity, reset } from './avalanche-test.reducer';
import { IAvalancheTest } from 'app/shared/model/avalanche-test.model';
// tslint:disable-next-line:no-unused-variable
import { convertDateTimeFromServer } from 'app/shared/util/date-utils';
import { keysToValues } from 'app/shared/util/entity-utils';

export interface IAvalancheTestUpdateProps extends StateProps, DispatchProps, RouteComponentProps<{ id: number }> {}

export interface IAvalancheTestUpdateState {
  isNew: boolean;
}

export class AvalancheTestUpdate extends React.Component<IAvalancheTestUpdateProps, IAvalancheTestUpdateState> {
  constructor(props) {
    super(props);
    this.state = {
      isNew: !this.props.match.params || !this.props.match.params.id
    };
  }

  componentDidMount() {
    if (this.state.isNew) {
      this.props.reset();
    } else {
      this.props.getEntity(this.props.match.params.id);
    }
  }

  saveEntity = (event, errors, values) => {
    values.dateCreated = new Date(values.dateCreated);

    if (errors.length === 0) {
      const { avalancheTestEntity } = this.props;
      const entity = {
        ...avalancheTestEntity,
        ...values
      };

      if (this.state.isNew) {
        this.props.createEntity(entity);
      } else {
        this.props.updateEntity(entity);
      }
      this.handleClose();
    }
  };

  handleClose = () => {
    this.props.history.push('/entity/avalanche-test');
  };

  render() {
    const { avalancheTestEntity, loading, updating } = this.props;
    const { isNew } = this.state;

    return (
      <div>
        <Row className="justify-content-center">
          <Col md="8">
            <h2 id="avalancheTestsApp.avalancheTest.home.createOrEditLabel">Create or edit a AvalancheTest</h2>
          </Col>
        </Row>
        <Row className="justify-content-center">
          <Col md="8">
            {loading ? (
              <p>Loading...</p>
            ) : (
              <AvForm model={isNew ? {} : avalancheTestEntity} onSubmit={this.saveEntity}>
                {!isNew ? (
                  <AvGroup>
                    <Label for="id">ID</Label>
                    <AvInput id="avalanche-test-id" type="text" className="form-control" name="id" required readOnly />
                  </AvGroup>
                ) : null}
                <AvGroup>
                  <Label id="lonLabel" for="lon">
                    Lon
                  </Label>
                  <AvField id="avalanche-test-lon" type="number" className="form-control" name="lon" />
                </AvGroup>
                <AvGroup>
                  <Label id="latLabel" for="lat">
                    Lat
                  </Label>
                  <AvField id="avalanche-test-lat" type="number" className="form-control" name="lat" />
                </AvGroup>
                <AvGroup>
                  <Label id="placeLabel" for="place">
                    Place
                  </Label>
                  <AvField id="avalanche-test-place" type="text" name="place" />
                </AvGroup>
                <AvGroup>
                  <Label id="dangerLevelLabel" for="dangerLevel">
                    Danger Level
                  </Label>
                  <AvField id="avalanche-test-dangerLevel" type="number" className="form-control" name="dangerLevel" />
                </AvGroup>
                <AvGroup>
                  <Label id="contentLabel" for="content">
                    Content
                  </Label>
                  <AvField id="avalanche-test-content" type="text" name="content" />
                </AvGroup>
                <AvGroup>
                  <Label id="userLabel" for="user">
                    User
                  </Label>
                  <AvField
                    id="avalanche-test-user"
                    type="text"
                    name="user"
                    validate={{
                      required: { value: true, errorMessage: 'This field is required.' },
                      minLength: { value: 2, errorMessage: 'This field is required to be at least {{ min }} characters.' }
                    }}
                  />
                </AvGroup>
                <AvGroup>
                  <Label id="dateCreatedLabel" for="dateCreated">
                    Date Created
                  </Label>
                  <AvInput
                    id="avalanche-test-dateCreated"
                    type="datetime-local"
                    className="form-control"
                    name="dateCreated"
                    value={isNew ? null : convertDateTimeFromServer(this.props.avalancheTestEntity.dateCreated)}
                    validate={{
                      required: { value: true, errorMessage: 'This field is required.' }
                    }}
                  />
                </AvGroup>
                <Button tag={Link} id="cancel-save" to="/entity/avalanche-test" replace color="info">
                  <FontAwesomeIcon icon="arrow-left" />&nbsp;
                  <span className="d-none d-md-inline">Back</span>
                </Button>
                &nbsp;
                <Button color="primary" id="save-entity" type="submit" disabled={updating}>
                  <FontAwesomeIcon icon="save" />&nbsp; Save
                </Button>
              </AvForm>
            )}
          </Col>
        </Row>
      </div>
    );
  }
}

const mapStateToProps = (storeState: IRootState) => ({
  avalancheTestEntity: storeState.avalancheTest.entity,
  loading: storeState.avalancheTest.loading,
  updating: storeState.avalancheTest.updating
});

const mapDispatchToProps = {
  getEntity,
  updateEntity,
  createEntity,
  reset
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AvalancheTestUpdate);

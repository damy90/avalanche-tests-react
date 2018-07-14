import isEqual from 'lodash/isEqual';
import axios from 'axios';
import {
  parseHeaderForLinks,
  loadMoreDataWhenScrolled,
  ICrudGetAction,
  ICrudGetAllAction,
  ICrudPutAction,
  ICrudDeleteAction
} from 'react-jhipster';

import { cleanEntity } from 'app/shared/util/entity-utils';
import { REQUEST, SUCCESS, FAILURE } from 'app/shared/reducers/action-type.util';

import { IAvalancheTest, defaultValue } from 'app/shared/model/avalanche-test.model';
import { ITEMS_PER_PAGE } from 'app/shared/util/pagination.constants';

export const ACTION_TYPES = {
  FETCH_AVALANCHETEST_LIST: 'avalancheTest/FETCH_AVALANCHETEST_LIST',
  FETCH_AVALANCHETEST: 'avalancheTest/FETCH_AVALANCHETEST',
  CREATE_AVALANCHETEST: 'avalancheTest/CREATE_AVALANCHETEST',
  UPDATE_AVALANCHETEST: 'avalancheTest/UPDATE_AVALANCHETEST',
  DELETE_AVALANCHETEST: 'avalancheTest/DELETE_AVALANCHETEST',
  RESET: 'avalancheTest/RESET'
};

const initialState = {
  loading: false,
  errorMessage: null,
  entities: [] as ReadonlyArray<IAvalancheTest>,
  entity: defaultValue,
  links: { next: 0 },
  updating: false,
  totalItems: 0,
  updateSuccess: false
};

export type AvalancheTestState = Readonly<typeof initialState>;

// Reducer

export default (state: AvalancheTestState = initialState, action): AvalancheTestState => {
  switch (action.type) {
    case REQUEST(ACTION_TYPES.FETCH_AVALANCHETEST_LIST):
    case REQUEST(ACTION_TYPES.FETCH_AVALANCHETEST):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        loading: true
      };
    case REQUEST(ACTION_TYPES.CREATE_AVALANCHETEST):
    case REQUEST(ACTION_TYPES.UPDATE_AVALANCHETEST):
    case REQUEST(ACTION_TYPES.DELETE_AVALANCHETEST):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        updating: true
      };
    case FAILURE(ACTION_TYPES.FETCH_AVALANCHETEST_LIST):
    case FAILURE(ACTION_TYPES.FETCH_AVALANCHETEST):
    case FAILURE(ACTION_TYPES.CREATE_AVALANCHETEST):
    case FAILURE(ACTION_TYPES.UPDATE_AVALANCHETEST):
    case FAILURE(ACTION_TYPES.DELETE_AVALANCHETEST):
      return {
        ...state,
        loading: false,
        updating: false,
        updateSuccess: false,
        errorMessage: action.payload
      };
    case SUCCESS(ACTION_TYPES.FETCH_AVALANCHETEST_LIST):
      const links = parseHeaderForLinks(action.payload.headers.link);
      return {
        ...state,
        links,
        loading: false,
        totalItems: action.payload.headers['x-total-count'],
        entities: loadMoreDataWhenScrolled(state.entities, action.payload.data, links, ITEMS_PER_PAGE)
      };
    case SUCCESS(ACTION_TYPES.FETCH_AVALANCHETEST):
      return {
        ...state,
        loading: false,
        entity: action.payload.data
      };
    case SUCCESS(ACTION_TYPES.CREATE_AVALANCHETEST):
    case SUCCESS(ACTION_TYPES.UPDATE_AVALANCHETEST):
      return {
        ...state,
        updating: false,
        updateSuccess: true,
        entity: action.payload.data
      };
    case SUCCESS(ACTION_TYPES.DELETE_AVALANCHETEST):
      return {
        ...state,
        updating: false,
        updateSuccess: true,
        entity: {}
      };
    case ACTION_TYPES.RESET:
      return {
        ...initialState
      };
    default:
      return state;
  }
};

const apiUrl = 'api/avalanche-tests';

// Actions

export const getEntities: ICrudGetAllAction<IAvalancheTest> = (page, size, sort) => {
  const requestUrl = `${apiUrl}${sort ? `?page=${page}&size=${size}&sort=${sort}` : ''}`;
  return {
    type: ACTION_TYPES.FETCH_AVALANCHETEST_LIST,
    payload: axios.get<IAvalancheTest>(`${requestUrl}${sort ? '&' : '?'}cacheBuster=${new Date().getTime()}`)
  };
};

export const getEntity: ICrudGetAction<IAvalancheTest> = id => {
  const requestUrl = `${apiUrl}/${id}`;
  return {
    type: ACTION_TYPES.FETCH_AVALANCHETEST,
    payload: axios.get<IAvalancheTest>(requestUrl)
  };
};

export const createEntity: ICrudPutAction<IAvalancheTest> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.CREATE_AVALANCHETEST,
    payload: axios.post(apiUrl, cleanEntity(entity))
  });
  dispatch(getEntities());
  return result;
};

export const updateEntity: ICrudPutAction<IAvalancheTest> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.UPDATE_AVALANCHETEST,
    payload: axios.put(apiUrl, cleanEntity(entity))
  });
  dispatch(getEntities());
  return result;
};

export const deleteEntity: ICrudDeleteAction<IAvalancheTest> = id => async dispatch => {
  const requestUrl = `${apiUrl}/${id}`;
  const result = await dispatch({
    type: ACTION_TYPES.DELETE_AVALANCHETEST,
    payload: axios.delete(requestUrl)
  });
  dispatch(getEntities());
  return result;
};

export const reset = () => ({
  type: ACTION_TYPES.RESET
});

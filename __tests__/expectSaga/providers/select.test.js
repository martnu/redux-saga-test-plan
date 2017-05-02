// @flow
import { put, select } from 'redux-saga/effects';
import expectSaga from 'expectSaga';
import * as m from 'expectSaga/matchers';
import { dynamic } from 'expectSaga/providers';

const getValue = () => 0;
const getOtherValue = state => state.otherValue;

function* saga() {
  const value = yield select(getValue);
  const otherValue = yield select(getOtherValue);

  yield put({ type: 'DONE', payload: value + otherValue });
}

test('uses provided value for `select`', () => (
  expectSaga(saga)
    .withState({ otherValue: 22 })
    .provide({
      select({ selector }, next) {
        if (selector === getValue) {
          return 20;
        }

        return next();
      },
    })
    .put({ type: 'DONE', payload: 42 })
    .run()
));

test('uses static provided values from redux-saga/effects', () => (
  expectSaga(saga)
    .withState({ otherValue: 22 })
    .provide([
      [select(getValue), 20],
    ])
    .put({ type: 'DONE', payload: 42 })
    .run()
));

test('uses static provided values from matchers', () => (
  expectSaga(saga)
    .withState({ otherValue: 22 })
    .provide([
      [m.select(getValue), 20],
    ])
    .put({ type: 'DONE', payload: 42 })
    .run()
));

test('uses partial static provided values from matchers', () => (
  expectSaga(saga)
    .withState({ otherValue: 22 })
    .provide([
      [m.select.selector(getValue), 20],
    ])
    .put({ type: 'DONE', payload: 42 })
    .run()
));

test('uses dynamic values for static providers', () => (
  expectSaga(saga)
    .withState({ otherValue: 22 })
    .provide([
      [m.select.selector(getValue), dynamic(() => 20)],
    ])
    .put({ type: 'DONE', payload: 42 })
    .run()
));

test('dynamic values have access to effect', () => (
  expectSaga(saga)
    .withState({ otherValue: 22 })
    .provide([
      [m.select.selector(getValue), dynamic(({ selector }) => {
        expect(selector).toBe(getValue);
        return 20;
      })],
    ])
    .put({ type: 'DONE', payload: 42 })
    .run()
));

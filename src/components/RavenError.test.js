import React from 'react';
import { shallow } from 'enzyme';

jest.mock('../sentry');

import RavenError from './RavenError';
import { Raven } from '../sentry';

const testError = { error: 'test error' };
const testDetails = { details: 'test details' };

describe('RavenError', () => {
  test('rendering', () => {
    const component = shallow(
      <RavenError
        error={ testError }
        details={ testDetails }
        heading="Test error"/>
    );
    expect(component).toMatchSnapshot();
  });

  test('captures exception', () => {
    shallow(
      <RavenError
        error={ testError }
        details={ testDetails }
        heading="Test error"/>
    );
    expect(Raven.captureException).toHaveBeenCalledWith(testError, testDetails);
  });

  test('error reporting', () => {
    Raven.lastEventId.mockReturnValue(1);
    const component = shallow(
      <RavenError
        error={ testError }
        details={ testDetails }
        heading="Test error"/>
    );
    const eventObj = { preventDefault: jest.fn() };
    component.find('a').simulate('click', eventObj);

    expect(eventObj.preventDefault).toHaveBeenCalled();
    expect(Raven.showReportDialog).toHaveBeenCalled();
  });
});
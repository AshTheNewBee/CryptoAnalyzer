import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

import Enzyme, { shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
Enzyme.configure({ adapter: new Adapter() });

function setup() {
  const enzymeWrapper = shallow(<App />);

  return {
    enzymeWrapper
  };
}

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<App />, div);
  ReactDOM.unmountComponentAtNode(div);
});

it('should return the formatted and calculated/analysed date, currency, bestBuyingPrice, bestBuyingTime and profit', () => {
  const { enzymeWrapper } = setup();
  let obj = {
    date: '2018-05-07',
    currency: 'BTC',
    bestBuyingPrice: '34.98',
    bestBuyingTime: '09:15am',
    bestSellingPrice: '37.01',
    bestSellingTime: '12:30pm',
    profit: '2.03' 
  }
  
  expect(enzymeWrapper.instance().state.analysedArr).toContainEqual(obj)
});

// it('should return best time to buy the currency', () => {
    
// });

// it('should return best time to sell the currency', () => {
    
// });

// it('should return the profit for the day', () => {
    
// });

// it('should filter by date', () => {
    
// });

// it('should filter by currency', () => {
    
// });

// it('should return all currency data when user clicks More button', () => {
    
// });

it('should convert the time from 24hrs to 12hrs', () => {
  const { enzymeWrapper } = setup();
  expect(enzymeWrapper.instance().convertTime('1200')).toMatch('12:00pm')
  expect(enzymeWrapper.instance().convertTime('1300')).toMatch('1:00pm')
  expect(enzymeWrapper.instance().convertTime('2400')).toMatch('12:00am')
});
import React from 'react';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import BootstrapTable from 'react-bootstrap-table-next';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css'; 
import filterFactory, {
  textFilter,
  dateFilter
} from 'react-bootstrap-table2-filter';

import './App.css';
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';
import CryptoData from './store/CryptoData.json';

/*********************************
 * @CryptoAnalyzer
 *  App for analyzing crypto currencies data and 
 *  process historical price list of currencies provided by a currency exchange
 *  
 * Assumptions:
  1. Input time will always be in 24hrs
  2. Input date will always be formated in yyyymmdd
  3. Buying time ends at 1200 hence, returns the best price before 1200
 `4. Selling time starts after 1200 hence, returns the best price after 1200
 * 
*********************************/ 

export default class App extends React.Component {
  state = {
    analysedArr: [],
    error: ''
  }

  componentDidMount() {
    this.filterData()
  }

  /*********************************
   * @filterData
   *  - loads the crypto currency data from the Json file and for each currency data
   *      - formats the date into yyyy-mm-dd
   *      - gets the currency name
   *    - for each quotes for the currency data
   *      - finds the lowest buying quote
   *      - finds the largest selling quote
   *    - calculate the profit by substracting best selling price from best buying price
   *    - pushes each calculated data: (currency, date, bestBuyingPrice, bestBuyingTime, bestSellingPrice, bestSellingTime, profit) to filteredArr 
   *      and then into analysedArr state
   *  
   *********************************/

  filterData = () => {
    let currencyName, date, bestBuyingQuote, bestSellingQuote, profit, filteredArr = []

    CryptoData.forEach(data => {
      currencyName = data.currency
      let dateSplit = data.date.match(/.{1,2}/g)
      date = (`${dateSplit[0]}${dateSplit[1]}-${dateSplit[2]}-${dateSplit[3]}`)

      let quotes = data.quotes;
      bestBuyingQuote = quotes[0]
      bestSellingQuote = quotes[0]

      for (let i = 0; i < quotes.length; i++) {
        if (quotes[i].time < 1200) {
          bestBuyingQuote = bestBuyingQuote.price < quotes[i].price ? bestBuyingQuote : quotes[i]
        } else {
          bestSellingQuote = bestSellingQuote.price > quotes[i].price ? bestSellingQuote : quotes[i]
        }
      }

      profit = bestSellingQuote.price - bestBuyingQuote.price

      filteredArr.push({
        date: date,
        currency: currencyName,
        bestBuyingPrice: bestBuyingQuote.price,
        bestBuyingTime: this.convertTime(bestBuyingQuote.time),
        bestSellingPrice: bestSellingQuote.price,
        bestSellingTime: this.convertTime(bestSellingQuote.time),
        profit: profit.toFixed(2),
      })
     
    });
    this.setState({
      analysedArr: [...filteredArr]
    })
  }

  /*********************************
   * @convertTime
   *  converts the time from military based to 12hrs
   *    - create an array to separated time into 2 digits 
   *      ie: if time is 1230 creates array of [12, 30]
   *    - if hrs is less than 12 
   *     returns the time by 'hr:min am' format
   *      else if hrs is more than 12 
   *      and if time is 2400 make amOrPm=am else
   *     returns the remainder of 12 and if remainder is 0 sends 12 instead by 'hr:min pm' format
   *  @return converted time
   *********************************/
  convertTime = (time) => {
    let amOrPM, hr
    let timeArr = time.match(/.{1,2}/g)
    if (timeArr[0] < 12) {
      amOrPM = 'am'
      hr = timeArr[0]
    } else {
      time === '2400' ?  amOrPM = 'am' : amOrPM = 'pm'
      hr = timeArr[0] % 12 === 0 ? 12 : timeArr[0] % 12
    }
    return `${hr}:${timeArr[1]}${amOrPM}`
  }

   /*********************************
   * @render
   *  - dataColumns: create the columns for the BootstrapTable with appropriate filters and sorts
   *  - defaultSorted: sorts the table by max profit
   * @returns
   *  - Sortable and searchable table
   * 
   *********************************/
  render() {
    const dataColumns = [{
        dataField: 'date',
        text: 'Date',
        filter: dateFilter({
          defaultValue: {
            date: new Date(2018, 5, 7)
          }
        })
      },
      {
        text: 'Currency',
        dataField: 'currency',
        sort: true,
        filter: textFilter()
      },
      {
        text: 'Buy',
        dataField: 'bestBuyingPrice',
        sort: true
      },
      {
        text: 'Best Buy At',
        dataField: 'bestBuyingTime',
        sort: true
      },
      {
        text: 'Sell',
        dataField: 'bestSellingPrice',
        sort: true
      },
      {
        text: 'Best Sell At',
        dataField: 'bestSellingTime',
        sort: true
      },
      {
        text: 'Profit',
        dataField: 'profit',
        sort: true
      }
    ]

    const defaultSorted = [{
      dataField: 'profit',
      order: 'desc'
    }];

    return ( 
      <Container maxWidth = "lg" id="analyzer">
        <Grid container spacing = {3} >
          <Grid item xs = {12} >
            <Typography className = "title" variant = "h3" component = "h3" > 
              Crypto Analyzer 
            </Typography> 
          </Grid> 
          <Grid item xs = {12} >
            <Paper className = "paper" >
              <BootstrapTable keyField = "profit"
                data = {this.state.analysedArr}
                columns = {dataColumns}
                filter = {filterFactory()}
                defaultSorted = {defaultSorted }
                bordered = {false}/>
            </Paper> 
          </Grid> 
        </Grid> 
      </Container>
    );
  }
}
import React, { Component } from 'react';
import axios from 'axios';

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      inputCurrency: '1',
      shown: true,
      newCurrency:'AUD',
      defaultCurrency:'IDR,JPY'
    };

    this.handleChange = this.handleChange.bind(this);
    this.toggleForm = this.toggleForm.bind(this);
    this.addMoreCurrency = this.addMoreCurrency.bind(this);
    this.submitCurrency = this.submitCurrency.bind(this);
    this.componentWillMount = this.componentWillMount.bind(this);
    this.deleteCurrency = this.deleteCurrency.bind(this);
  }
  
  handleChange(event) {
    this.setState({inputCurrency: event.target.value});
  }  

  toggleForm(){
    this.setState({shown: !this.state.shown});
  }

  addMoreCurrency(event){
    this.setState({ newCurrency: event.target.value});
  }

  submitCurrency(event){
    event.preventDefault();
    var defaultCur = this.state.defaultCurrency;
    const newCur = this.state.newCurrency;

    defaultCur +=','+newCur;

    this.callApi(defaultCur);
    this.toggleForm();
  }

  deleteCurrency(item){
    var param = this.state.defaultCurrency.replace(item,'');
    this.callApi(param);
  }

  callApi(param){
    axios.get(`http://api.exchangeratesapi.io/latest?base=USD&symbols=`+param)
      .then(res => {
        const convertCurrency = res.data.rates;
        this.setState({ convertCurrency : convertCurrency });
        this.setState({ defaultCurrency : param });
      })
  }

  componentDidMount() {
    const param = this.state.defaultCurrency
    this.callApi(param)
  }

  componentWillMount() {
    axios.get(`http://api.exchangeratesapi.io/latest?base=USD`)
      .then(res => {
        const listAllCurrency = res.data.rates;
        this.setState({ listAllCurrency : listAllCurrency });
      })
  }

  render() {

    var defaultCurrency = this.state.convertCurrency
    var AllCurrency = this.state.listAllCurrency
    var multiple = this.state.inputCurrency
    var currency = [];
    var option = [];

    var shown = {
      display: this.state.shown ? "block" : "none"
    };
    
    var hidden = {
      display: this.state.shown ? "none" : "block"
    }


    if(this.state.convertCurrency!==undefined){
      for (const [key, value] of Object.entries(defaultCurrency)) {
        const defaultCurrencyValue = value*multiple;
        currency.push(
        <div key={key} className="card sm-4 shadow-sm">
          <div className="card-body">
            <div className="row">
              <div className="col-11">
                <ul className="list-group list-group-flush">
                  <li className="list-group-item">{key} <span className="float-right"><b>{defaultCurrencyValue.toFixed(2)}</b></span></li>
                  <li className="list-group-item">1 USD = {key} {value}</li>
                </ul>
              </div>
              <div className="col-1">
                <div className="row">
                  <button type="button" onClick={this.deleteCurrency.bind(this, key)} className="btn btn-danger" title="remove">X</button>
                </div>
              </div>
            </div>
          </div>
        </div>
        )
      }
    }

    if(this.state.listAllCurrency!==undefined){
      for (const [key] of Object.entries(AllCurrency)) {
        option.push(
          <option key={key} value={key}>{key}</option>
        )
      }
    }
    
    return (
      <div>
        <div className="container-fluid">
          <div className="row  justify-content-center">
            <div className="card sm-4 shadow-sm">
              <div className="card-header">
                <div className="row">
                  <div className="col-12">
                    <h6 className="my-0 font-weight-normal">USD - United States Dollars</h6>
                  </div>
                  <div className="col-6">
                    <h3>USD</h3>
                  </div>
                  <div className="col-6">
                    <input type="number" value={this.state.inputCurrency} className="form-control" onChange={this.handleChange} ></input>
                  </div>
                </div>
              </div>
              <div className="card-body">
                <div className="row" >
                  <div className="col-12">
                    {currency}
                  </div>
                </div>
              </div>
              <div className="card-footer">
                <div className="row" style={ shown }>
                  <div className="col-12">
                    <button className="btn btn-block btn-primary" onClick={this.toggleForm}>+ Add Currency</button>
                  </div>
                </div>
                <div className="row" style={ hidden } >
                  <form onSubmit={this.submitCurrency}>
                    <div className="col-12">
                      <select value={this.state.newCurrency} onChange={this.addMoreCurrency} className="form-control">
                        {option}
                      </select>
                    </div>
                    <br></br>
                    <div className="col-12">
                      <button type="submit" className="btn btn-primary btn-block">Submit</button>
                    </div>
                    <br></br>
                    <div className="col-12">
                      <button className="btn btn-danger btn-block" onClick={this.toggleForm}>Back</button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default App;

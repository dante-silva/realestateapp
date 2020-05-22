import React, { Component} from 'react'
import ReactDOM from 'react-dom'
import Header from './Header.js'
import Filter from './Filter.js'
import Listings from './Listings.js'
import ListingsData from './data/ListingsData.js'


class App extends Component {
  constructor () {
    super()
    this.state = {
       name: 'Joe',
       ListingsData: ListingsData,
       city: 'All',
       houseType: 'All',
       bedrooms: 3,
       min_price: 0,
       max_price: 10000000,
       min_floor_space: 0,
       max_floor_space: 50000,
       elevator: false,
       finished_basement: false,
       gym: false,
       swimming_pool: false,
       filteredData : ListingsData,
       populateFormsData: '',
       sortby: 'price-dsc',
       view: 'box',
       search: '',

  }
    this.change = this.change.bind(this)
    this.filteredData = this.filteredData.bind(this)
    this.populateForms = this.populateForms.bind(this)
    this.changeView = this.changeView.bind(this)
  }
  componentWillMount(){

    var ListingsData = this.state.ListingsData.sort((a, b) =>{
      return a.price - b.price
    })


    this.setState({
      ListingsData
    })
  }
  change(event){

    var name = event.target.name
    var value = (event.target.type === 'checkbox') ? event.target.checked : event.target.value

    this.setState({
      [name]: value
    }, () => {
      console.log(this.state)
      this.filteredData()
    })

  }
  changeView(viewName){
    this.setState({
      view: viewName
    })
  }

  filteredData(){
    var newData = this.state.ListingsData.filter((item) => {
      return item.price >= this.state.min_price && item.price <= this.state.max_price && item.floorSpace >= this.state.min_floor_space && item.floorSpace <= this.state.max_floor_space && item.rooms >= this.state.bedrooms
    })

    if(this.state.city != "All"){
      newData = newData.filter((item) => {
        return item.city == this.state.city
      })
    }

    if(this.state.houseType != "All"){
      newData = newData.filter((item) => {
        return item.houseType == this.state.houseType
      })
    }

    if(this.state.sortby == 'price-dsc'){
      newData = newData.sort((a, b) => {
        return a.price - b.price
      })
    }
    if(this.state.sortby == 'price-asc'){
      newData = newData.sort((a, b) => {
        return b.price - a.price
      })
    }
    // if(this.state.swimming_pool != false){
    //   newData = newData.filter((item) => {
    //     return item.extras == this.state.swimming_pool
    //   })
    // }

    if(this.state.search != ''){
      newData = newData.filter((item) => {
        var city = item.city.toLowerCase()
        var searchText = this.state.search.toLowerCase()
        var n = city.match(searchText)

        if(n != null){
          return true
        }
      })
    }

    this.setState({
      filteredData: newData
    })
  }

  populateForms() {
    //city
    var cities = this.state.ListingsData.map((item) => {
      return item.city
    })
    cities = new Set(cities)
    cities = [...cities]

    cities = cities.sort()

    //houseType
    var houseType = this.state.ListingsData.map((item) => {
      return item.houseType
    })
    houseType = new Set(houseType)
    houseType = [...houseType]

    houseType = houseType.sort()

    //bedrooms
    var bedrooms = this.state.ListingsData.map((item) => {
      return item.rooms
    })
    bedrooms = new Set(bedrooms)
    bedrooms = [...bedrooms]

    bedrooms = bedrooms.sort()

    //  extras
    // var extras = this.state.ListingsData.map((item) => {
    //   return item.extras.checked
    // })
    // extras = new Set(extras)
    // extras = [...extras]
    //
    // extras = extras.sort(),

    this.setState({
      populateFormsData: {
        houseType,
        bedrooms,
        cities,
        // extras
      }
    }, () => {
      // console.log(this.state)
    })

  }

  render () {
    return (<div>

      <Header />

      <section id="content-area">
        <Filter change={this.change} globalState={this.state} populateAction={this.populateForms}/>
        <Listings  ListingsData={this.state.filteredData} change={this.change} globalState={this.state} changeView={this.changeView} />
      </section>

      </div>)
  }
}

const app = document.getElementById('app')

ReactDOM.render(<App />, app)

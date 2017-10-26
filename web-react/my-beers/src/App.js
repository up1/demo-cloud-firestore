import React, { Component } from 'react';
import './App.css';

import firebase from './firebase.js';

class App extends Component {
  constructor() {
    super()
    this.state = {
      beerName: '',
      alcohol: '',
      price: '',
      searchWord: '',
      brewer: '',
      allBeer: []
    }
    this.handleChanged = this.handleChanged.bind(this);
    this.handleNewBeer = this.handleNewBeer.bind(this);
    this.handleSearchBeer = this.handleSearchBeer.bind(this);
    this.reloadData = this.reloadData.bind(this);
  }

  handleChanged(e) {
    this.setState({
      [e.target.name]: e.target.value
    })
  }

  handleNewBeer(e) {
    e.preventDefault()
    const db = firebase.firestore();
    //1. Create beer document
    const beer = {
      beerName: this.state.beerName,
      alcohol: this.state.alcohol,
      price: this.state.price
    }
    const brewer = this.state.brewer
    db.collection("beer").add(beer)
    .then(function(beerDocument) {
        console.log("Document written with ID: ", beerDocument.id)
        //2. Add brewer to beer
        const mockBrewery = [
          { name: "Stone" },
          { name: "Thai Local"}
        ]
        beerDocument.collection("brewery").add(mockBrewery[brewer])
        .then(function() {
            console.log("Add brewery success")
            this.setState({
              beerName: '',
              alcohol: '',
              price: ''
            });
            this.reloadData()
        })
        .catch(function(error) {
            console.error("Error adding brewery: ", error)
        });
        this.reloadData()
    })
    .catch(function(error) {
        console.error("Error adding document: ", error)
    });
    this.setState({
      beerName: '',
      alcohol: '',
      price: ''
    });
    this.reloadData()
  }

  handleSearchBeer(e) {
    e.preventDefault()
    if(this.state.searchWord === '') {
      this.reloadData()
      return
    }
    let _allBeer = []
    const db = firebase.firestore();
    db.collection("beer").where("beerName", "==", this.state.searchWord)
    .get()
    .then((querySnapshot) => {
    querySnapshot.forEach((doc) => {
      console.log(`${doc.id} => ${doc.data().beerName}`)
      var currentBeer = {
        id: doc.id,
        beerName: doc.data().beerName,
        alcohol: doc.data().alcohol,
        price: doc.data().price
      }
      //Get subcollection
      db.collection("beer").doc(doc.id).collection("brewery")
      .get()
      .then((querySnapshot2) => {
        querySnapshot2.forEach((brewDoc) => {
            currentBeer.breweryName = brewDoc.data().name
            _allBeer.push(currentBeer)
            this.setState({
              searchWord: '',
              allBeer: _allBeer
            })
        })
      })
    })
    this.setState({
      searchWord: '',
      allBeer: []
    })
  })
  }

  reloadData() {
    let _allBeer = []
    const db = firebase.firestore()
    db.collection("beer")
      .orderBy('beerName', 'asc')
      .orderBy('price', 'asc').get()
      .then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        console.log(`${doc.id} => ${doc.data().beerName}`)
        var currentBeer = {
          id: doc.id,
          beerName: doc.data().beerName,
          alcohol: doc.data().alcohol,
          price: doc.data().price
        }
        //Get subcollection
        db.collection("beer").doc(doc.id).collection("brewery")
        .get()
        .then((querySnapshot2) => {
          querySnapshot2.forEach((brewDoc) => {
              currentBeer.breweryName = brewDoc.data().name
              _allBeer.push(currentBeer)
              this.setState({
                allBeer: _allBeer
              })
          })
        })
        this.setState({
          allBeer: _allBeer
        })
      })
      this.setState({
        allBeer: _allBeer
      })
    })
  }

  removeBeerBy(beerId) {
    const db = firebase.firestore()
    db.collection("beer").doc(`${beerId}`).delete()
      .then(function() {
          console.log(`${beerId}`)
        }).catch(function(error) {
            console.error("Error removing document: ", error);
        });
    this.reloadData()
  }

  componentDidMount() {
    this.reloadData()
  }

  render() {
    return (
      <div className='app'>
        <header>
            <div className='wrapper'>
              <h1>My Beers Friends</h1>

            </div>
        </header>
        <div className='container'>
          <section className='add-item'>
              <form onSubmit={this.handleNewBeer}>
                <input type="text" name="beerName" placeholder="ชื่อเบียร์" onChange={this.handleChanged} value={this.state.beerName} />
                <input type="text" name="alcohol" placeholder="% of Alcohol" onChange={this.handleChanged} value={this.state.alcohol} />
                <input type="text" name="price" placeholder="ราคาเบียร์ (บาท)" onChange={this.handleChanged} value={this.state.price}  />
                <select name="brewer" onChange={this.handleChanged} value={this.state.brewer}>
                  <option>Choose brewer</option>
                  <option value="0">Stone</option>
                  <option value="1">Thai Local</option>
                </select>
                <button>Add new beer</button>
              </form>
              <p/>
              <form onSubmit={this.handleSearchBeer}>
                <input type="text" name="searchWord" placeholder="คำค้นหา" onChange={this.handleChanged} value={this.state.searchWord} />
                <button>Search</button>
              </form>
          </section>
          <section className='display-item'>
            <div className='wrapper'>
              <ul>
                {this.state.allBeer.map((beer) =>
                    <li key={beer.id}>
                      <h3>{beer.beerName}</h3>
                      <p>
                        ปริมาณ alcohol: <strong>{beer.alcohol} %</strong><br/>
                        ราคา: <strong>{beer.price} บาท</strong><br/>
                        ผู้ผลิต: <strong>{beer.breweryName}</strong>
                        <button onClick={() => this.removeBeerBy(beer.id)}>Remove Item</button>
                      </p>
                    </li>
                )}
              </ul>
            </div>
          </section>
        </div>
      </div>
    );
  }
}
export default App;

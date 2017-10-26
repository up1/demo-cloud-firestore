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
      allBeer: []
    }
    this.handleChanged = this.handleChanged.bind(this);
    this.handleNewBeer = this.handleNewBeer.bind(this);
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
    const beer = {
      beerName: this.state.beerName,
      alcohol: this.state.alcohol,
      price: this.state.price
    }
    db.collection("beer").add(beer)
    .then(function(docRef) {
        console.log("Document written with ID: ", docRef.id)
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

  reloadData() {
    let allBeer = []
    const db = firebase.firestore()
    db.collection("beer").get().then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        console.log(`${doc.id} => ${doc.data().beerName}`)
        allBeer.push(doc)
      })

      this.setState({
        allBeer: allBeer
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
                <button>Add new beer</button>
              </form>
          </section>
          <section className='display-item'>
            <div className='wrapper'>
              <ul>
                {this.state.allBeer.map((beer) =>
                    <li key={beer.id}>
                      <h3>{beer.data().beerName}</h3>
                      <p>
                        ปริมาณ alcohol: <strong>{beer.data().alcohol} %</strong><br/>
                        ราคา: <strong>{beer.data().price} บาท</strong>
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

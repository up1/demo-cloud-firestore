import React, { Component } from 'react';
import './App.css';

import firebase from './firebase.js';

class App extends Component {
  constructor() {
    super()
    this.state = {
      beerName: '',
      alcohol: 0.0,
      price: 0.0
    }
    this.handleChanged = this.handleChanged.bind(this);
    this.handleNewBeer = this.handleNewBeer.bind(this);
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
        console.log("Document written with ID: ", docRef.id);
    })
    .catch(function(error) {
        console.error("Error adding document: ", error);
    });
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
                <input type="text" name="beernName" placeholder="ชื่อเบียร์" onChange={this.handleChanged} />
                <input type="text" name="alcohol" placeholder="% of Alcohol" onChange={this.handleChanged} />
                <input type="text" name="price" placeholder="ราคาเบียร์ (บาท)" onChange={this.handleChanged} />
                <button>Add new beer</button>
              </form>
          </section>
          <section className='display-item'>
            <div className='wrapper'>
              <ul>
              </ul>
            </div>
          </section>
        </div>
      </div>
    );
  }
}
export default App;
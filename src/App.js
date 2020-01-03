import React, { Component } from 'react';
import './App.css';
import Card from './Card/Card';
import DrawButton from './DrawButton/DrawButton';
import firebase from 'firebase/app';
import 'firebase/database';
import { DB_CONFIG } from './Config/Firebase/db_config';

class App extends Component {
  constructor(props) {
    super(props);

    this.app = firebase.initializeApp(DB_CONFIG);
    this.database = this.app
      .database()
      .ref()
      .child('cards');
    this.updateCard = this.updateCard.bind(this);

    this.state = {
      cards: [
        { id: 1, question: 'what is this?', answer: 'an app' },
        { id: 2, question: 'what is that?', answer: 'also a app' },
      ],
      currentCards: {},
    };
  }

  componentWillMount() {
    const currentCards = this.state.cards;

    this.database.on('child_added', snap => {
      currentCards.push({
        id: snap.key,
        question: snap.val().question,
        answer: snap.val().answer,
      });
    });

    this.setState({
      cards: currentCards,
      currentCards: this.getRandomCard(currentCards),
    });
  }

  getRandomCard(currentCards) {
    let card = currentCards[Math.floor(Math.random() * currentCards.length)];
    return card;
  }

  updateCard() {
    const currentCards = this.state.cards;
    this.setState({
      currentCards: this.getRandomCard(currentCards),
    });
  }

  render() {
    return (
      <div className="App">
        <div className="cardRow">
          <Card
            question={this.state.currentCards.question}
            answer={this.state.currentCards.answer}
          />
        </div>
        <div className="buttonRow">
          <DrawButton drawCard={this.updateCard} />
        </div>
      </div>
    );
  }
}
export default App;

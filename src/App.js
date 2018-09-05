import React from 'react';
import './App.css';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import iter from './iter';
import LoginForm from './LoginForm';
import RemoveElement from './RemoveElement';
import { fire } from './config/Fire';

class App extends React.Component {
  state = {
    user: {},
    email: "",
    password: "",
    name: "",
    select: "github",
    data: [],
    grafick: false,
    userlist: [],
    authenticated: false,
  }

  componentDidMount() {
    this.authListener();
  }


  login = async e => {
    e.preventDefault();
    await fire.auth().signInWithEmailAndPassword(this.state.email, this.state.password).then(() => fire.database().ref(`Users/${this.state.user.uid}/state `).once('value').then((snap) => {
      const state = snap.val();
      this.setState({ ...state })
      console.log('state', state)
    })).catch((error) => {
      alert(error.message)
      console.log(error);
    });

  }

  signup = e => {
    e.preventDefault();
    fire.auth().createUserWithEmailAndPassword(this.state.email, this.state.password).catch((error) => {
      alert(error.message);
      console.log(error);
    })
  }

  logout = () => {
    fire.auth().signOut();
    this.setState({ name: "", select: "github", userlist: [], data: [], grafick: false })
  }

  authListener = () => {
    fire.auth().onAuthStateChanged((user) => {
      // console.log(user);
      if (user) {
        this.setState({ user, password: "" });
        // localStorage.setItem('user', user.uid);
      } else {
        this.setState({ user: null, password: "" });
        // localStorage.removeItem('user');
      }
    });
  }

  handleChangeUser = e => {
    this.setState({ name: e.target.value });
  }

  handleChangeEmail = (e) => {
    this.setState({ email: e.target.value })
  }

  handleChangePassword = (e) => {
    this.setState({ password: e.target.value })
  }

  saveChange = (e) => {
    e.preventDefault();
    fire.database().ref(`Users/${this.state.user.uid}/state `).set({ data: this.state.data, userlist: this.state.userlist, grafick: this.state.grafick })
    console.log("save");
    fire.database().ref(`Users/${this.state.user.uid}/state `).once('value').then(function(snap) {
      const state = snap.val();
      console.log('state', state)
    })
  }

  onClick = async (e) => {
    e.preventDefault();
    const objects = [];
    const { name, select, data, userlist } = this.state;
    
    switch(this.state.select) {
      case "github":
      await axios.get(`https://api.github.com/users/${name}/repos`)
      .then(res => res.data.map((item) => item.name))
      .then(async(res) => await axios.all(res.map((element) => axios.get(`https://api.github.com/repos/${name}/${element}/stats/participation`))))
      .then(res => res.map((element) => element.data.owner))
      .then(res => res.filter((element) => element.length !== 0))
      .then(res => res.reduce((acc, array) => {
        for (let i = 0; i < 52; i++) {
          acc[i] += array[i];
        } 
        return acc;
      }))
      .then(res => { 
        return res.map((element, id) => { 
        const a = { github: element, week: id + 1 };
        return objects.push(a);
        })
      })
      .then(() => {
        if (data.length === 0 && userlist.length === 0) {
          this.setState({ data: objects, grafick: true })
        } else if (data[0].github === undefined) {
          const newdataG = data.map((el, index) => Object.assign(el, objects[index]));
          this.setState({ data: newdataG, grafick: true });
          console.log('objects', objects);
          console.log('newdataG', newdataG);
        } else if (Boolean(userlist.find(el => el.name === name && el.source === select))) {
            console.log('yes user no add');
        } else {
            const newDataG = data.map((el, index) => {
            const github = el.github + objects[index].github;
            return { ...data[index], github, week: index + 1 };
            })
            this.setState({ data: newDataG, grafick: true });
            console.log('add');
            console.log('objects', objects);
            console.log('newDataG', newDataG);
          }
        if (userlist.length === 0) {
          console.log('no list')
          this.setState({ userlist: [...userlist, { name: this.state.name, source: select, data: objects }] });
        }
          else if (userlist.find(el => el.name === name && el.source === select)) {
            console.log('yes list, yes user');
          }
          else {
            this.setState({ userlist: [...userlist, { name: this.state.name, source: select, data: objects }] });
            console.log('yes list, no user');
          }
        })
      .catch(error => console.log('error: ', error));
      break;
    
      case "bitbucket":
      await axios.get(`https://bitbucket.org/!api/2.0/users/${this.state.name}/repositories`)
      .then(res => res.data.values.map((obj) => obj.name).map(element => element.replace(/ /g,'-')))
      .then(res =>  axios.all(res.map((element) => axios.get(`https://bitbucket.org/!api/2.0/repositories/${this.state.name}/${element}/commits`)))
      .then(res => res.map((element) => element.data))
      .then(res => res.map(element => {
        const arr = [];
          for (let i = 0; i < 52; i++) {
              arr.push({ bitbucket: 0, week: i + 1 })
          }
          console.log('begin arr = ', arr)
        return iter(element, arr);
      }))
      .then(res => {
        res.map(element => {
          return element.then(res => {
            res ? objects.push(res) : console.log('ooops!');
          })
        }
        )
        console.log('tyt konec', objects[0])})
      ).then(() => {
        if (data.length === 0 && userlist.length === 0) {
          this.setState({ data: objects[0], grafick: true })
        } else if (data[0].bitbucket === undefined) {
          const newdataB = data.map((el, index) => Object.assign(el, objects[0][index]));
          this.setState({ data: newdataB, grafick: true });
          console.log('newdataB', newdataB);
        } else if (Boolean(userlist.find(el => el.name === name && el.source === select))) {
          console.log('yes user no add');
        } else {
          const newDataB = data.map((el, index) => {
          const bitbucket = el.bitbucket + objects[0][index].bitbucket;
          return { ...data[index], bitbucket, week: index + 1 }
          })
          this.setState({ data: newDataB, grafick: true })
          console.log('add');
          console.log('objects', objects);
          console.log('newDataB', newDataB);
        }

        if (userlist.length === 0) {
          console.log('no list')
          this.setState({ userlist: [...userlist, { name: this.state.name, source: select, data: objects[0] }] });
        } 
        else if (userlist.find(el => el.name === name && el.source === select)) {
          console.log('yes list, yes user');
        }
        else {
          this.setState({ userlist: [...userlist, { name: this.state.name, source: select, data: objects[0] }] });
          console.log('yes list, no user');
        }
      })
      .catch(error => console.log('error: ', error));
      break;

      default:
      alert('oops!');
    }
  }

  removeElement = id => {
    const { data, userlist } = this.state;
    console.log('id', id);
    const removedData = data.map((el, index) => {
      if (el.bitbucket && userlist[id].data[index].bitbucket) {
        return {...el, bitbucket: el.bitbucket -= userlist[id].data[index].bitbucket}
      } else if (el.github && userlist[id].data[index].github) {
        return {...el, github: el.github -= userlist[id].data[index].github}
      } else {
        console.log('ooops!');
        return {...el};
      }
    })

    
    this.setState({ data: userlist.length === 1 ? [] : removedData, userlist: userlist.filter((el, index) => index !== id) });
  }

  handleSelectChange = (e) => {
    this.setState({ select: e.target.value })
  }

  renderForm() {
    return (
      <div className="app">
        <LoginForm 
        email = {this.state.email}
        password = {this.state.password}
        onChangeEmail={this.handleChangeEmail}
        onChangePassword = {this.handleChangePassword}
        onClickLogin={this.login}
        onClickSignup={this.signup}
        />
      </div>
    )
  }

  renderGraf() {
    const { data, name, userlist } = this.state;

    return (
      <div>
        <form className="findform">
          <input className="userinput" autoFocus onChange={this.handleChangeUser} value={name} />
          <select className="select" value={this.state.select} onChange={this.handleSelectChange}> 
            <option value="github">GitHub</option>
            <option value="bitbucket">Bitbucket</option>
          </select>
          <button className="btn-submit" type="submit" onClick={this.onClick}>Find and Add</button>
        </form>
        <button className="button-logout" type="submit" onClick={this.logout}>Logout</button>
          <ul>
            {this.state.userlist.map(
            (element, index) => {return <RemoveElement className="list" data={userlist} list={element} key={index} id={index} removeElement={this.removeElement} />}
            )}
          </ul>
        <button className="button-save" onClick={this.saveChange}>Save changes</button>
        <div className="container">
          {this.state.grafick && Boolean(this.state.userlist.length) &&
          <div>
            <BarChart width={800} height={500} data={data} margin={{top: 20, right: 30, left: 20, bottom: 5}}>
              <CartesianGrid />
              <XAxis dataKey="week" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="github" stackId="a" fill="red" />
              <Bar dataKey="bitbucket" stackId="a" fill="#82ca9d" />
            </BarChart>
          </div>}
        </div>
      </div>
    )
  }

  render() { 
    return (
      <div>
        {this.state.user ? this.renderGraf() : this.renderForm()}
      </div>
    )
  }
}

export default App;

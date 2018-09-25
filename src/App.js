import React from 'react';
import './App.css';
import axios from 'axios';
import iter from './Components/iter';
import { Button, Form, FormGroup, InputGroup, FormControl, DropdownButton, MenuItem } from 'react-bootstrap';
import CustomNavbar from './Components/CustomNavbar';
import RemoveElement from './Components/RemoveElement';
import { fire } from './config/Fire';
import Chart from './Components/Chart';

class App extends React.Component {
  state = {
    user: {},
    email: "",
    password: "",
    nickname: "",
    name: "",
    select: "github",
    data: [],
    grafick: false,
    userlist: [],
  }

  componentDidMount(){
    this.authListener();
  }

  login = async e => {
    e.preventDefault();
    await fire.auth().signInWithEmailAndPassword(this.state.email, this.state.password).catch((error) => {
      alert(error.message);
      this.setState({ password: ""})
      console.log(error);
    })

    if (this.state.user) {
    await fire.database().ref(`Users/${this.state.user.uid}/state `).once('value').then((snap) => {
      const state = snap.val();
      this.setState({ ...state });
    })
  }}

  signup = async (e) => {
    e.preventDefault();

    if (this.state.nickname.length < 1) {
      alert("Please enter  your nickname");
    } else {
      await fire.auth().createUserWithEmailAndPassword(this.state.email, this.state.password)
      .then(async () => {
        await fire.database().ref(`Users/${this.state.user.uid}/state `).set({ nickname: this.state.nickname }).catch((error) => {
          alert(error.message);
          console.log(error);
      })
    })
    .catch((error) => {
      alert(error.message);
      this.setState({ password: "", nickname: "" });
      console.log(error);
  })
     
    }
  }

  logout = () => {
    fire.auth().signOut();
    this.setState({ nickname: "", name: "", select: "github", userlist: [], data: [], grafick: false });
  }

  authListener = () => {
    fire.auth().onAuthStateChanged((user) => {
      if (user) {
        this.setState({ user, email: "", password: "" }, () => {
          fire.database().ref(`Users/${this.state.user.uid}/state `).once('value').then((snap) => {
            const state = snap.val();
            this.setState({ ...state });
          })
        });
      } else {
        this.setState({ user: null, password: "" });
      }
    });
  }

  handleChangeUser = e => {
    this.setState({ name: e.target.value.toLowerCase() });
  }

  handleChangeEmail = e => {
    this.setState({ email: e.target.value });
  }

  handleChangePassword = e => {
    this.setState({ password: e.target.value });
  }

  handleChangeNickName = e => {
    this.setState({ nickname: e.target.value });
  }

  handleSelectChange = (eventKey) => {
    this.setState({ select: eventKey });
  }

  onClickGithub = async (e) => {
    e.preventDefault();
    const git = [];
    const { name, select, data, userlist } = this.state;
    
    await axios.get(`https://api.github.com/users/${name}/repos`)
    .then(async (res) => {
      if (res.data.length < 1) {
        const arr = [];
        for (let i = 0; i < 52; i++) {
          arr.push({ github: 0, week: i + 1 });
        }

        if (data.length === 0 && userlist.length === 0) {
          this.setState({ data: arr, grafick: true });
        } else if (data[0].github === undefined) {
          const newdataG = data.map((element, index) => {
            const newElem = {...element};
            const a = Object.assign(newElem, arr[index]);
            return a;
          });
          this.setState({ data: newdataG, grafick: true });
        } else if (Boolean(userlist.find(el => el.name === name && el.source === select))) {
            console.log('yes user no add');
        } else {
            const newDataG = data.map((el, index) => {
            const github = el.github + arr[index].github;
            return { ...data[index], github, week: index + 1 };
            })
            this.setState({ data: newDataG, grafick: true });
        }
            
        if (userlist.length === 0) {
          const firstUser = { name: this.state.name, source: select, data: arr };
          this.setState({ userlist: [firstUser] });
        } else if (userlist.find(el => el.name === name && el.source === select)) {
            console.log('yes list, yes user');
        } else {
          this.setState({ userlist: [...userlist, { name: this.state.name, source: select, data: arr }] });
        }

        fire.database().ref(`Users/${this.state.user.uid}/state `).set({ data: this.state.data, userlist: this.state.userlist, grafick: this.state.grafick, nickname: this.state.nickname });
        } else {
          await axios.get(`https://api.github.com/users/${name}/repos`)
          .then(res => res.data.map((item) => item.name))
          .then(async (res) => await axios.all(res.map(async (element) => await axios.get(`https://api.github.com/repos/${name}/${element}/stats/participation`))))
          .then(res =>  res.map((element) => element.data.owner))
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
          git.push(a);
          return a;
          })
        })
        .then(() => {
          if (data.length === 0 && userlist.length === 0) {
            this.setState({ data: git, grafick: true });
          } else if (data[0].github === undefined) {  
            const newdataG = data.map((element, index) => {
              const newElem = {...element};
              const a = Object.assign(newElem, git[index]);
              return a;
            });
            this.setState({ data: newdataG, grafick: true });
          } else if (Boolean(userlist.find(el => el.name === name && el.source === select))) {
              console.log('yes user no add');
          } else {
              const newDataG = data.map((el, index) => {
              const github = el.github + git[index].github;
              return { ...data[index], github, week: index + 1 };
              })
              this.setState({ data: newDataG, grafick: true });
            }
          if (userlist.length === 0) {
            const firstUser = { name: this.state.name, source: select, data: git };
            this.setState({ userlist: [firstUser] });
          } else if (userlist.find(el => el.name === name && el.source === select)) {
              console.log('yes list, yes user');
          } else {
              this.setState({ userlist: [...userlist, { name: this.state.name, source: select, data: git }] });
          }})
          .then(() => {
            fire.database().ref(`Users/${this.state.user.uid}/state `).set({ data: this.state.data, userlist: this.state.userlist, grafick: this.state.grafick, nickname: this.state.nickname });
      })
      .catch(error => console.log(error));
      }
    })
    .catch(error => console.log(error));
  }
      
  onClickBitbucket = async (e) => {
    e.preventDefault();
    const bit = [];
    const { name, select, data, userlist } = this.state;
    
    await axios.get(`https://bitbucket.org/!api/2.0/users/${this.state.name}/repositories`)
    .then(async (res) => {
      if (res.data.values.length < 1) {
        const arr = [];
        for (let i = 0; i < 52; i++) {
          arr.push({ bitbucket: 0, week: i + 1 })
        }

        if (data.length === 0 && userlist.length === 0) {
          this.setState({ data: arr, grafick: true });
        } else if (data[0].bitbucket === undefined) {
          const newdataB = data.map((element, index) => {
            const newElem = {...element};
            const a = Object.assign(newElem, arr[index]);
            return a;
          });
          this.setState({ data: newdataB, grafick: true });
        } else if (Boolean(userlist.find(element => element.name === name && element.source === select))) {
          console.log('yes user no add');
        } else {
          const newDataB = data.map((element, index) => {
          const bitbucket = element.bitbucket + arr[index].bitbucket;
          return { ...data[index], bitbucket, week: index + 1 };
          });
          this.setState({ data: newDataB, grafick: true });
        }

        if (userlist.length < 1) {
          this.setState({ userlist: [{ name: this.state.name, source: select, data: arr }] });
        } 
        else if (userlist.find(el => el.name === name && el.source === select)) {
          console.log('yes list, yes user');
        }
        else {
          this.setState({ userlist: [...userlist, { name: this.state.name, source: select, data: arr }] });
        }
        fire.database().ref(`Users/${this.state.user.uid}/state `).set({ data: this.state.data, userlist: this.state.userlist, grafick: this.state.grafick, nickname: this.state.nickname });
        } else {

        await axios.get(`https://bitbucket.org/!api/2.0/users/${this.state.name}/repositories`)
        .then(res => res.data.values.map((obj) => obj.name).map(element => element.replace(/ /g,'-')))
        .then(res =>  axios.all(res.map((element) => axios.get(`https://bitbucket.org/!api/2.0/repositories/${this.state.name}/${element}/commits`)))
        .then(res => res.map((element) => element.data))
        .then(res => res.map(element => {
          const arr = [];
            for (let i = 0; i < 52; i++) {
                arr.push({ bitbucket: 0, week: i + 1 });
            }
          return iter(element, arr);
        }))
        .then(res => {
          res.map(element => {
            return element.then(res => {
              if (res) {
                bit.push(res);
              }
            })
          })
        }))
        .then(() => {
          if (data.length === 0 && userlist.length === 0) {
            this.setState({ data: bit[0], grafick: true });
          } else if (data[0].bitbucket === undefined) {
            const newdataB = data.map((element, index) => {
              const newElem = {...element};
              const a = Object.assign(newElem, bit[0][index]);
              return a;
            });
            this.setState({ data: newdataB, grafick: true });
          } else if (Boolean(userlist.find(element => element.name === name && element.source === select))) {
            console.log('yes user no add');
          } else {
            const newDataB = data.map((element, index) => {
            const bitbucket = element.bitbucket + bit[0][index].bitbucket;
            return { ...data[index], bitbucket, week: index + 1 };
            });
            this.setState({ data: newDataB, grafick: true });
          }

          if (userlist.length < 1) {
            this.setState({ userlist: [{ name: this.state.name, source: select, data: bit[0] }] });
          } 
          else if (userlist.find(el => el.name === name && el.source === select)) {
            console.log('yes list, yes user');
          }
          else {
            this.setState({ userlist: [...userlist, { name: this.state.name, source: select, data: bit[0] }] });
          }
        }).then(() => {
          fire.database().ref(`Users/${this.state.user.uid}/state `).set({ data: this.state.data, userlist: this.state.userlist, grafick: this.state.grafick, nickname: this.state.nickname });
        })
        .catch(error => console.log(error));
      }
    }).catch(error => console.log(error));
  }

  removeElement = id => {
    const { data, userlist } = this.state;
    const removedData = data.map((el, index) => {
      if (el.bitbucket && userlist[id].data[index].bitbucket) {
        return {...el, bitbucket: el.bitbucket -= userlist[id].data[index].bitbucket};
      } else if (el.github && userlist[id].data[index].github) {
        return {...el, github: el.github -= userlist[id].data[index].github};
      } else {
        return {...el};
      }
    })
    
    this.setState({ data: userlist.length === 1 ? [] : removedData, userlist: userlist.filter((el, index) => index !== id) }, () => {
      fire.database().ref(`Users/${this.state.user.uid}/state `).set({ data: this.state.data, userlist: this.state.userlist, grafick: this.state.grafick, nickname: this.state.nickname })
    });
  }

  renderForm() {
    return (
      <CustomNavbar 
        email = {this.state.email}
        password = {this.state.password}
        nickname = {this.state.nickname}
        onChangeEmail={this.handleChangeEmail}
        onChangePassword = {this.handleChangePassword}
        onChangeNickName = {this.handleChangeNickName}
        onClickLogin={this.login}
        onClickSignup={this.signup}
        user={this.state.user}
      />
    )
  }

  renderGraf() {
    const { data, name } = this.state;

    return (
      <div>
        <CustomNavbar
          nickname={this.state.nickname}
          logout={this.logout}
          user={this.state.user}
        />
        <Form inline>
        {this.state.grafick && Boolean(this.state.userlist.length) && <Chart data={data}/>}
          <FormGroup>
            <InputGroup>
              <FormControl type="text" autoFocus onChange={this.handleChangeUser} value={name}/>
              <DropdownButton
                componentClass={InputGroup.Button}
                id="input-dropdown-addon"
                title={this.state.select}
                pullRight
              >
                <MenuItem eventKey="github" onSelect={this.handleSelectChange}>github</MenuItem>
                <MenuItem eventKey="bitbucket" onSelect={this.handleSelectChange}>bitbucket</MenuItem>
              </DropdownButton>
            </InputGroup>
          </FormGroup>
          <Button bsStyle="danger" type="submit" onClick={this.state.select === "github" ? this.onClickGithub : this.onClickBitbucket}>Find and Add</Button>
        </Form>
        <div className="userlist">
          <ul style={{ fontSize: "20px"}}>
            {this.state.userlist.map(
            (element, index) => <RemoveElement className="list" list={element} key={index} id={index} removeElement={this.removeElement} />
            )}
          </ul>
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

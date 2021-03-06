import React, { Component } from 'react';

import './styles/main.css';

import 'bootstrap/dist/css/bootstrap.min.css';


class LoginHandler extends Component {
    constructor(props) {
        super(props);
        this.updateUsername = this.updateUsername.bind(this);
        this.updatePassword = this.updatePassword.bind(this);
        this.login = this.login.bind(this);

        this.state = {username: '', password: '', errors: {}};
    }

    handleValidation(){
        let newErrors = {};
        let formIsValid = true;

        if (!this.state.username || this.state.username === '') {
           formIsValid = false;
           newErrors["username"] = "The username cannot be empty.";
        } else if (typeof this.state.username !== "undefined") {
             if(!this.state.username.match(/^[a-zA-Z]+$/)){
                 formIsValid = false;
                 newErrors["username"] = "The username must constains only letters.";
             }          
        }

       this.setState({errors: newErrors});

       return formIsValid;
   }

    login(event) {
        event.preventDefault();

        if (!this.handleValidation()) {
            return;
        }

        let self = this;
        let url = 'http://' + process.env.REACT_APP_HOST + '/login';
        let data = {username: this.state.username, password: this.state.password};

        // TODO: timeout
        fetch(
            url, {
                method: 'POST',
                body: JSON.stringify(data),
                headers: {'Content-Type': 'application/json'},
                mode: 'cors'
            }
        ).then(function(response) {
            if (response.status !== 200) {
                throw new Error(response.status);
            }
            return response.json();
        }).then(function(data) {
            self.props.onSubmit(
                data['terminal_path'],
                data['auth_token'],
                data['administrator']
            );
        }).catch(function (error) {
            if (error.message === '401') {
                // TODO: show this info to the user
                console.log('No perms');
            } else {
                console.log('Error with the request');
                console.log(error);
            }
        });
    }

    updateUsername(event) {
        this.setState({username: event.target.value});
    }

    updatePassword(event) {
        this.setState({password: event.target.value});
    }

    render() {
        return (
            <div className="full-container">
                <h1 className="login-title">termi.net</h1>
                <form className="login-container" onSubmit={this.login}>
                    <h1 className="login-subtitle">Please, sign in</h1>
                    <span style={{color: 'red', minHeight: 24}}>{this.state.errors["username"]}</span>
                    <input
                        className="login-form" type="text"
                        placeholder="username"
                        value={this.state.username}
                        onChange={this.updateUsername}
                    />
                    <input
                        className="login-form" type="password"
                        placeholder="password"
                        value={this.state.password}
                        onChange={this.updatePassword}
                        style={{marginTop: 10}}
                    />
                    <span style={{ minHeight: 24}}/>
                    <button className="btn btn-notification btn-outline-secondary login-submit" type='submit'>
                        sign in
                    </button>
                </form>
            </div>
        );
    }
}


export default LoginHandler;

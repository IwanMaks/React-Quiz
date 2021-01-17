import React, {Component} from "react";
import classes from "./Auth.css";
import Button from "../../components/UI/Button/Button";
import Input from "../../components/UI/Input/Input";
import {connect} from "react-redux";
import {auth} from "../../store/actions/auth";

function validateEmail(email) {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

class Auth extends Component {
    state = {
        isFormValid: false,
        formControls: {
            email: {
                value: '',
                type: 'email',
                label: 'Email',
                errorMessage: 'Enter the correct email address',
                valid: false,
                touched: false,
                validation: {
                    required: true,
                    email: true
                }
            },
            password: {
                value: '',
                type: 'password',
                label: 'Password',
                errorMessage: 'Enter the correct password',
                valid: false,
                touched: false,
                validation: {
                    required: true,
                    minLength: 6
                }
            }
        }
    }

    loginHandler = () => {
        this.props.auth(this.state.formControls.email.value, this.state.formControls.password.value, true)
    }

    registerHandler = () => {
        this.props.auth(this.state.formControls.email.value, this.state.formControls.password.value, false)

        // try {
        //     const response = await axios.post('https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyAgBogD-Zhnpx7pnP3OfC6CqP-lf8V_HGQ', authData)
        //     console.log(response.data)
        // } catch (e) {
        //     console.log(e)
        // }
    }

    submitHandler = event => {
        event.preventDefault();
    }

    validateControl(value, validation) {
        if (!validation) {
            return true;
        }

        let isValid = true;

        if (validation.required) {
            isValid = value.trim() !== '' && isValid
        }

        if (validation.email) {
            isValid = validateEmail(value) && isValid
        }

        if (validation.minLength) {
            isValid = value.trim().length >= validation.minLength && isValid
        }

        return isValid;
    }

    onChangeHandler = (event, item) => {
        const formControls = { ...this.state.formControls }
        const control = { ...formControls[item] }

        control.value = event.target.value
        control.touched = true;
        control.valid = this.validateControl(control.value, control.validation)

        formControls[item] = control

        let isFormValid = true

        Object.keys(formControls).forEach(name => {
            isFormValid = formControls[name].valid && isFormValid
        })

        this.setState({formControls, isFormValid})
    }

    renderInputs() {
        return Object.keys(this.state.formControls).map((item, index) => {
            const control = this.state.formControls[item];
            return (
                <Input
                    key={item + index}
                    type={control.type}
                    value={control.value}
                    valid={control.valid}
                    touched={control.touched}
                    label={control.label}
                    errorMessage={control.errorMessage}
                    shouldValidate={!!control.validation}
                    onChange={event => {
                        this.onChangeHandler(event, item)
                    }}
                />
            )
        })
    }

    render() {
        return (
            <div className={classes.Auth}>
                <div>
                    <h1>Auth</h1>

                    <form onSubmit={this.submitHandler} className={classes.AuthForm}>
                        {this.renderInputs()}

                        <Button type='success' onClick={this.loginHandler} disabled={!this.state.isFormValid}>Sign In</Button>
                        <Button type='primary' onClick={this.registerHandler} disabled={!this.state.isFormValid}>Sign Up</Button>
                    </form>
                </div>
            </div>
        )
    }
}

function mapDispatchToProps(dispatch) {
    return {
        auth: (email, password, isLogin) => dispatch(auth(email, password, isLogin))
    }
}

export default connect(null, mapDispatchToProps)(Auth)
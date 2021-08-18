import React, { useReducer, useEffect, useState } from 'react';

import Card from '../UI/Card/Card';
import classes from './Login.module.css';
import Button from '../UI/Button/Button';

const inputInitialState = { value: '', isValid: null };

const emailReducer = (state, action) => {
  switch (action.type) {
    case 'USER_INPUT':
      return { value: action.payload, isValid: action.payload.includes('@') };

    default:
      throw new Error();
  }
};

const passwordReducer = (state, action) => {
  switch (action.type) {
    case 'USER_INPUT':
      return {
        value: action.payload,
        isValid: action.payload.trim().length > 6,
      };

    default:
      throw new Error();
  }
};

const Login = (props) => {
  const [formIsValid, setFormIsValid] = useState(false);
  const [emailState, dispatchEmail] = useReducer(
    emailReducer,
    inputInitialState
  );
  const [passwordState, dispatchPassword] = useReducer(
    passwordReducer,
    inputInitialState
  );

  useEffect(() => {
    const userKeystroke = setTimeout(() => {
      console.log('Checking form validity / sending http request');
      setFormIsValid(emailState.isValid && passwordState.isValid);
    }, 700);

    /*
     * With Cleanup function u dont need to send a http request for every user
     * input is change. You can wait for a several time to send a request to
     * the server. Read more here https://reactjs.org/docs/hooks-effect.html
     */
    return () => {
      console.log('This is the clean up function');
      clearTimeout(userKeystroke);
    };
  }, [emailState, passwordState]);

  const emailChangeHandler = (event) => {
    dispatchEmail({ type: 'USER_INPUT', payload: event.target.value });
  };

  const passwordChangeHandler = (event) => {
    dispatchPassword({ type: 'USER_INPUT', payload: event.target.value });
  };

  const submitHandler = (event) => {
    event.preventDefault();
    props.onLogin(emailState.value, passwordState.value);
  };

  return (
    <Card className={classes.login}>
      <form onSubmit={submitHandler}>
        <div
          className={`${classes.control} ${
            emailState.isValid === false ? classes.invalid : ''
          }`}
        >
          <label htmlFor="email">E-Mail</label>
          <input
            type="email"
            id="email"
            value={emailState.value}
            onChange={emailChangeHandler}
          />
        </div>
        <div
          className={`${classes.control} ${
            passwordState.isValid === false ? classes.invalid : ''
          }`}
        >
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={passwordState.value}
            onChange={passwordChangeHandler}
          />
        </div>
        <div className={classes.actions}>
          <Button type="submit" className={classes.btn} disabled={!formIsValid}>
            Login
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default Login;

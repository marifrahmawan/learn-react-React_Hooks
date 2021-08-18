import React, {
  useReducer,
  useEffect,
  useState,
  useContext,
  useRef,
} from 'react';

import Card from '../UI/Card/Card';
import classes from './Login.module.css';
import Button from '../UI/Button/Button';
import { AuthContext } from '../../store/auth-context';
import Input from '../UI/Input/Input';

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
  const ctx = useContext(AuthContext);

  const [formIsValid, setFormIsValid] = useState(false);
  const [emailState, dispatchEmail] = useReducer(
    emailReducer,
    inputInitialState
  );
  const [passwordState, dispatchPassword] = useReducer(
    passwordReducer,
    inputInitialState
  );

  /*
   * We can destructuring the state so we dont need to re-render / re-run the component
   * when the state is have a value that we want. In this case we want to valid the form.
   * So when the state is valid and we add more character, the component is not re-render unless
   * the state is invalid.
   */
  const { isValid: emailIsValid } = emailState;
  const { isValid: passwordIsValid } = passwordState;

  useEffect(() => {
    const userKeystroke = setTimeout(() => {
      console.log('Checking form validity / sending http request');
      setFormIsValid(emailIsValid && passwordIsValid);
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
  }, [emailIsValid, passwordIsValid]);

  const emailChangeHandler = (event) => {
    dispatchEmail({ type: 'USER_INPUT', payload: event.target.value });
  };

  const passwordChangeHandler = (event) => {
    dispatchPassword({ type: 'USER_INPUT', payload: event.target.value });
  };

  const emailInputRef = useRef();
  const passwordInputRef = useRef();

  const submitHandler = (event) => {
    event.preventDefault();

    if (formIsValid) {
      ctx.onLogin(emailState.value, passwordState.value);
    } else if (!emailIsValid) {
      emailInputRef.current.focus();
    } else {
      passwordInputRef.current.focus();
    }
  };

  return (
    <Card className={classes.login}>
      <form onSubmit={submitHandler}>
        <Input
          ref={emailInputRef}
          id="email"
          label="E-mail"
          type="email"
          isValid={emailIsValid}
          value={emailState.value}
          onChange={emailChangeHandler}
        />

        <Input
          ref={passwordInputRef}
          id="password"
          label="Password"
          type="password"
          isValid={passwordIsValid}
          value={passwordState.value}
          onChange={passwordChangeHandler}
        />

        <div className={classes.actions}>
          <Button type="submit" className={classes.btn}>
            Login
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default Login;

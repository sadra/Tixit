import { useState } from 'react';
import useRequest from '../../hooks/use-request'

const signup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const {doRequest, errors} = useRequest({
    url: '/api/users/signup',
    method: 'post',
    body: {
      email, password
    }
  });

  const onSubmit = async (event) => {
    event.preventDefault();
    doRequest();
  };

  return (
    <div className='container'>
      <form onSubmit={onSubmit}>
        <h1>Sign Up</h1>
        <div className='from-group'>
          <label>Email Address</label>
          <input
            className='form-control'
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className='from-group'>
          <label>Password</label>
          <input
            type='password'
            className='form-control'
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        {errors}
        <button className='btn btn-primary form-control'>Sing Up</button>
      </form>
    </div>
  );
};

export default signup;

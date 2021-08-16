import { useState } from 'react';
import useRequest from '../../hooks/use-request';
import Router from 'next/router';

const signin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { doRequest, errors } = useRequest({
    url: '/api/users/signin',
    method: 'post',
    body: {
      email,
      password,
    },
    onSuccess: () => Router.push('/'),
  });

  const onSubmit = async (event) => {
    event.preventDefault();
    await doRequest();
  };

  return (
    <div className='container'>
      <form onSubmit={onSubmit}>
        <h1>Sign In</h1>
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
        <button className='btn btn-primary form-control'>Sing In</button>
      </form>
    </div>
  );
};

export default signin;

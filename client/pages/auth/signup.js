import { useState } from 'react';

const signup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const onSubmit = (event) => {
    event.preventDefault();

    alert(`${email}, ${password}`);
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
        <button className='btn btn-primary form-control'>Sing Up</button>
      </form>
    </div>
  );
};

export default signup;

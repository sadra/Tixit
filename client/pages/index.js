import axios from 'axios';
import buildClient from '../api/build-client';

const LandingPage = ({ currentUser }) => {
  return currentUser ? (
    <h1>You are Signed in</h1>
  ) : (
    <h1>You are NOT Signed in</h1>
  );
};

LandingPage.getInitialProps = async ({ context }) => {
  const client = buildClient(context);

  const { data } = client.get(`/api/users/currentuser`).catch((err) => {
    console.log(err.message);
  });

  return data;
};

export default LandingPage;

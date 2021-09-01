import Link from 'next/link';

const header = ({ currentUser }) => {
  const links = [
    !currentUser && { label: 'Sing Up', href: '/auth/signup' },
    !currentUser && { label: 'Sing In', href: '/auth/signin' },
    currentUser && { label: 'Sell Tickets', href: '/tickets/new' },
    currentUser && { label: 'My Orders', href: '/orders' },
    currentUser && { label: 'Sing Out', href: '/auth/signout' },
  ]
    .filter((linkConfig) => linkConfig)
    .map(({ label, href }) => {
      return (
        <li key={href} className='nav-item'>
          <a className='nav-link'>{label}</a>
        </li>
      );
    });

  return (
    <nav className='navbar navbar-light bg-light'>
      <Link href='/'>
        <a className='navbar-brand'>TixIt</a>
      </Link>
      <div className='d-flex justify-content-end'>
        <ul className='nav d-flex align-items-center'>{links}</ul>
      </div>
    </nav>
  );
};

export default header;

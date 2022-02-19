import { FaMagic } from 'react-icons/fa';
import { Heading, Input, Button } from '@chakra-ui/react';
import { signIn, useSession } from 'next-auth/react';
import { useState } from 'react';
import { useRouter } from 'next/router';

import EmailSentModal from '../../components/EmailSentModal';

import styles from '../../styles/signin.module.scss';
import Head from 'next/head';

export default function SignIn() {
  const router = useRouter();
  const { status } = useSession();

  const [email, setEmail] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [show, setShow] = useState(false);

  const onSubmit = (e) => {
    e.preventDefault();
    if (loading) return;

    setLoading(true);
    setError(null);

    signIn('email', {
      email,
      redirect: false,
      callbackUrl: router.query.callbackUrl,
    })
      .then(() => {
        setShow(true);
        setLoading(false);
      })
      .catch((error) => {
        setError(error);
        setLoading(false);
      });

    setTimeout(() => {
      setLoading(false);
      setShow(true);
    }, 4000);
  };

  console.log(status);

  return (
    <>
      <Head>
        <title>Sign In | Login with Raman Magic NextAuth</title>
      </Head>
      <main
        className={styles.pageContainer}
        style={{ filter: show && 'blur(10px)' }}
      >
        <FaMagic fontSize="3rem" color="#346DF1" />
        <Heading as={'h1'}>Sign in to your account</Heading>
        <form className={styles.form} onSubmit={onSubmit}>
          <label>
            <p>Email address</p>
            <Input
              placeholder="raman@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </label>
          <Button
            isLoading={status === 'loading'}
            bgColor="blue.500"
            color="white"
            _hover={{ backgroundColor: 'blue.600' }}
            type="submit"
            as="button"
          >
            Sign in
          </Button>
          <button>{loading ? 'Loading...' : 'sign in'}</button>
        </form>
      </main>
      {show && typeof window !== 'undefined' ? (
        <EmailSentModal email={email} />
      ) : (
        ''
      )}
    </>
  );
}

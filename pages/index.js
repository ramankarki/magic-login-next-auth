import { signOut, useSession } from 'next-auth/react';
import { Heading, Text, Button } from '@chakra-ui/react';
import { useRouter } from 'next/router';

import styles from '../styles/home.module.scss';
import Head from 'next/head';

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();

  return (
    <main className={styles.container}>
      <Head>
        <title>Login with Raman Magic NextAuth</title>
      </Head>
      <Heading as={'h1'}>
        Magic Link Authentication in Next.js with NextAuth and MongoDB
      </Heading>
      {status === 'authenticated' ? (
        <>
          <Text>Logged in as {session.user.email}</Text>
          <Button onClick={signOut}>Logout</Button>
        </>
      ) : (
        <Button
          onClick={() =>
            router.push('/auth/signin?callbackUrl=http://localhost:3000/')
          }
          isLoading={status === 'loading'}
        >
          Login
        </Button>
      )}
    </main>
  );
}

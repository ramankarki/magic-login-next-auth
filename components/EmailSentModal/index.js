import { createPortal } from 'react-dom';
import { HiOutlineMailOpen } from 'react-icons/hi';
import { Heading, Text } from '@chakra-ui/react';

import styles from './style.module.scss';

export default function EmailSentModal({ email }) {
  return createPortal(
    <div className={styles.container}>
      <HiOutlineMailOpen fontSize={'2.5rem'} color="#346DF1" />
      <Heading as="h1">Confirm your email</Heading>
      <Text>
        We emailed a magic link to <b>{email}</b>. Check your inbox and click
        the button in the email to login.
      </Text>
    </div>,
    document.body
  );
}

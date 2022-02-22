import { FaGithub} from 'react-icons/fa';
import { FiX } from 'react-icons/fi';
import { signIn, useSession } from 'next-auth/react';

import styles from './styles.module.scss';

export function SignButton() {
  const { data: session} = useSession();

  console.log(session);

  return session ? (
    <button 
    type="button"
    className={styles.signButton}
    >
      <FaGithub color="#04D361" />
      Gabriel Oliveira
      <FiX 
        color="#737380"
        className={styles.closeIcon}
      />
    </button> 
  ) :
  (
    <button 
    type="button"
    className={styles.signButton}
    onClick={() => signIn('github')}
    >
      <FaGithub color="#EBA417" />
      Sing in with GitHub
    </button> 
  )
}
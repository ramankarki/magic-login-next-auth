import { Button } from '@chakra-ui/react';

const Chakratest = () => {
  return (
    <Button
      m="3rem"
      as="a"
      href="/"
      bgGradient="linear(to-l,green, blue, red)"
      color="transparent"
      bgClip="text"
      _hover={{ backgroundColor: 'transparent' }}
    >
      this is something wrong
    </Button>
  );
};

export default Chakratest;

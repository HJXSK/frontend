import {Slot, Stack} from 'expo-router';

function AuthLayout(): React.JSX.Element {
  return (
    <Stack>
      <Slot />
    </Stack>
  );
}

export default AuthLayout;

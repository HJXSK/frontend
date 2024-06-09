import {
  Text,
  View,
  StyleSheet,
  Switch,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {toggle_ProfanityFilter} from '@/redux/features/settings/settingsSlice';
import {RootState} from '@/redux/store';
import {FontAwesome} from '@expo/vector-icons';
import {UnknownAction} from '@reduxjs/toolkit';
import {useTheme} from '@/themes';
import {getAuth, signOut} from 'firebase/auth';

type ItemType = 'switch' | 'category';

// Define the type for each item in the settings data
type Item = {
  title: string; // The title of the item
  index: string; // The index of the item in the settings state
  action: () => UnknownAction; // The action to be dispatched when the switch is toggled
  type: ItemType; // The type of the item (e.g. switch)
  isLast?: boolean; // Optional flag to indicate if it's the last item in the section
};

type Section = {
  data: Item[];
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 20,
    marginVertical: 30,
  },
  item: {
    backgroundColor: 'white',
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemData: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 7,
    paddingLeft: 0,
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 18,
  },
  section: {
    marginBottom: 20,
    borderRadius: 10,
    overflow: 'hidden',
  },
  signOutButtonContainer: {
    backgroundColor: 'white',
    padding: 7,
    borderRadius: 10,
  },
  signOutButtonText: {
    textAlign: 'center',
    fontSize: 18,
  },
});

const DataItem: React.FC<Item> = ({
  title,
  type,
  index,
  action,
  isLast = false,
}: Item): JSX.Element => {
  const itemState = useSelector(
    (state: RootState) => state.settings[index as keyof RootState['settings']],
  );
  const dispatch = useDispatch();
  switch (type) {
    case 'switch':
      return (
        <View style={styles.item}>
          <View style={{padding: 10}}>
            <FontAwesome
              name="exclamation-circle"
              size={25}
              color={'#EE4B2B'}
            />
          </View>
          <View
            style={[
              styles.itemData,
              !isLast && {
                borderBottomColor: 'lightgray',
                borderBottomWidth: 0.2,
              },
            ]}>
            <Text style={styles.title}>{title}</Text>
            <Switch
              onChange={() => {
                dispatch(action());
              }}
              value={itemState}
            />
          </View>
        </View>
      );
  }
  return <></>;
};

const SETTINGS: {section: string; data: Item[]}[] = [
  {
    section: 'Account',
    data: [
      {
        title: 'Profanity Filter',
        type: 'switch',
        index: 'gs_settings_profanity_filter',
        action: toggle_ProfanityFilter,
      },
    ],
  },
];

const DataSection: React.FC<Section> = ({data}: Section): JSX.Element => {
  return (
    <View style={styles.section}>
      {data.map((item, index) => {
        return (
          <DataItem
            key={index}
            title={item.title}
            index={item.index}
            type={item.type}
            action={item.action}
            isLast={data.length - 1 == index}
          />
        );
      })}
    </View>
  );
};

const Settings: React.FC = (): JSX.Element => {
  // Get the current theme
  const theme = useTheme();

  // Get the authentication instance
  const auth = getAuth();

  // Function to handle sign out
  const handleSignOut = () => {
    signOut(auth)
      .then(() => {
        console.log('Signed out');
      })
      .catch(error => {
        console.error(error);
      });
  };

  return (
    <ScrollView>
      <View style={styles.container}>
        {SETTINGS.map((item, index) => (
          <DataSection key={index} data={item.data} />
        ))}

        <TouchableOpacity
          style={styles.signOutButtonContainer}
          onPress={handleSignOut}>
          <Text
            style={[styles.signOutButtonText, {color: theme.colors.danger}]}>
            Sign out
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default Settings;

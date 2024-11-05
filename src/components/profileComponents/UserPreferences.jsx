import {StyleSheet, View, Text} from 'react-native';

// **3rd party imports
import LinearGradient from 'react-native-linear-gradient';
import {COLORS, FONTS} from '../../constants/theme/theme';

export default function UserPreferences({preferences}) {
  if (!preferences) {
    return null;
  }

  return (
    <View style={styles.tagBox}>
      {preferences?.map((data, i) => {
        return (
          <LinearGradient
            key={i}
            start={{x: 0, y: 0}}
            end={{x: 1, y: 0}}
            colors={['#3CFFD0', '#FE4EED']}
            style={styles.LinearGradientStyle2}>
            <View style={styles.tagBoxContianer}>
              <Text style={styles.tagText}>{data.name}</Text>
            </View>
          </LinearGradient>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  tagBox: {
    flexDirection: 'row',
    width: '100%',
    alignSelf: 'center',
    marginTop: 20,
    flexWrap: 'wrap',
  },
  LinearGradientStyle2: {
    borderRadius: 100,
    paddingLeft: 1,
    paddingRight: 1,
    paddingTop: 1,
    paddingBottom: 1,
    marginTop: 10,
    marginLeft: 5,
    marginRight: 5,
  },
  tagBoxContianer: {
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 3,
    paddingBottom: 3,
    borderRadius: 100,
    borderColor: COLORS.LIGHT,
    backgroundColor: COLORS.GREY_DARK,
  },
  tagText: {
    fontFamily: FONTS.MAIN_SEMI,
    fontSize: 10,
    color: COLORS.LIGHT,
  },
});

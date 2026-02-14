import React from 'react';
import { StyleSheet, Text, View, Dimensions, StatusBar, Platform, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { 
  useAnimatedScrollHandler, 
  useSharedValue, 
  useAnimatedStyle, 
  interpolate, 
  Extrapolation 
} from 'react-native-reanimated';

const { width, height } = Dimensions.get('window');

// Calculates the actual space available between the top of the screen and the tab bar
const TAB_BAR_HEIGHT = Platform.OS === 'ios' ? 90 : 70;
const VISIBLE_HEIGHT = height - TAB_BAR_HEIGHT;

const JOURNEY_DATA = [
  { 
    id: '1',
    title: "The Spark", 
    date: "JANUARY 1, 2024", 
    image: require('../assets/images/img1.png'),
    body: "One conversation. That's all it took. I didn't know it then, but I was talking to my future." 
  },
  { 
    id: '2',
    title: "First Sight", 
    date: "THE MEETUP", 
    image: require('../assets/images/img2.png'),
    body: "The butterflies were insane. But the moment I saw you, the nerves vanished. You felt like home." 
  },
  { 
    id: '3',
    title: "The Dreamer", 
    date: "EARLY DAYS", 
    image: require('../assets/images/img3.png'), 
    body: "You watched me code SecretBox till 3 AM. You didn't just tolerate my obsession; you fueled it." 
  },
  { 
    id: '4',
    title: "The Storm", 
    date: "FIRST FIGHT", 
    image: require('../assets/images/img4.png'),
    body: "We clashed. Hard. But in the silence that followed, we learned that our love is worth swallowing our pride." 
  },
  { 
    id: '5',
    title: "Healing", 
    date: "RECONCILIATION", 
    image: require('../assets/images/img5.png'),
    body: "We don't break. We bend, we learn, and we come back stronger. You are my peace, Bekky." 
  },
  { 
    id: '6',
    title: "Laughter", 
    date: "US BEING US", 
    image: require('../assets/images/img6.png'),
    body: "From silly arguments over games to your dramatic reactions. Life with you is never boring." 
  },
  { 
    id: '7',
    title: "My Anchor", 
    date: "HARD TIMES", 
    image: require('../assets/images/img7.png'),
    body: "When the world gets heavy, you are the only place I can rest. You saved me more times than you know." 
  },
  { 
    id: '8',
    title: "Growth", 
    date: "JEALOUSY", 
    image: require('../assets/images/img8.png'),
    body: "We used to assume. Now we ask. We are growing up, side by side." 
  },
  { 
    id: '9',
    title: "Wins", 
    date: "ACHIEVEMENTS", 
    image: require('../assets/images/img9.png'),
    body: "iPhone 11. Solar Power. Every win I have is empty if I can't share it with you." 
  },
  { 
    id: '10',
    title: "Chu Chu Mama", 
    date: "DAILY LOVE", 
    image: require('../assets/images/img10.png'),
    body: "I love your voice. I love your texts. I love being your 'Chu Chu Mama'." 
  },
  { 
    id: '11',
    title: "Forever", 
    date: "THE FUTURE", 
    image: require('../assets/images/img11.png'),
    body: "This is just the beginning, Aunty Rebe. Happy Valentine's Day. I love you." 
  }
];

const StoryCard = ({ item, index, scrollY }) => {
  const rStyle = useAnimatedStyle(() => {
    // Interpolation is now based on VISIBLE_HEIGHT to match the snapping interval
    const inputRange = [
      (index - 1) * VISIBLE_HEIGHT, 
      index * VISIBLE_HEIGHT, 
      (index + 1) * VISIBLE_HEIGHT
    ];

    const opacity = interpolate(scrollY.value, inputRange, [0, 1, 0], Extrapolation.CLAMP);
    const scale = interpolate(scrollY.value, inputRange, [0.8, 1, 0.8], Extrapolation.CLAMP);
    
    // Slight vertical shift as you scroll for a parallax effect
    const translateY = interpolate(scrollY.value, inputRange, [80, 0, -80], Extrapolation.CLAMP);

    return { 
      opacity, 
      transform: [{ scale }, { translateY }] 
    };
  });

  return (
    <View style={[styles.cardContainer, { height: VISIBLE_HEIGHT }]}>
      <Animated.View style={[styles.cardContent, rStyle]}>
        <View style={styles.imageContainer}>
          <Image source={item.image} style={styles.realImage} resizeMode="cover" />
        </View>
        <View style={styles.textWrapper}>
          <Text style={styles.date}>{item.date}</Text>
          <Text style={styles.title}>{item.title}</Text>
          <View style={styles.separator} />
          <Text style={styles.body}>{item.body}</Text>
        </View>
      </Animated.View>
    </View>
  );
};

export default function Journey() {
  const scrollY = useSharedValue(0);

  const scrollHandler = useAnimatedScrollHandler((event) => {
    scrollY.value = event.contentOffset.y;
  });

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <LinearGradient 
        colors={['#fff1f2', '#ffe4e6', '#fecdd3']} 
        style={StyleSheet.absoluteFill} 
      />
      
      <Animated.FlatList
        data={JOURNEY_DATA}
        keyExtractor={(item) => item.id}
        onScroll={scrollHandler}
        
        // Paging Settings to ensure cards snap to center
        pagingEnabled={false} 
        snapToInterval={VISIBLE_HEIGHT}
        snapToAlignment="center"
        decelerationRate="fast"
        
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={16}
        renderItem={({ item, index }) => (
          <StoryCard item={item} index={index} scrollY={scrollY} />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#fff' 
  },
  cardContainer: { 
    width: width, 
    justifyContent: 'center', 
    alignItems: 'center', 
    padding: 20 
  },
  cardContent: { 
    width: '100%', 
    alignItems: 'center' 
  },
  imageContainer: {
    marginBottom: 30,
    width: width * 0.75,
    height: width * 0.75,
    borderRadius: 20,
    shadowColor: '#BE185D',
    shadowOffset: { width: 0, height: 15 },
    shadowOpacity: 0.3,
    shadowRadius: 25,
    elevation: 15,
    backgroundColor: '#fff',
    borderWidth: 6,
    borderColor: '#fff',
  },
  realImage: { 
    width: '100%', 
    height: '100%', 
    borderRadius: 14 
  },
  textWrapper: { 
    alignItems: 'center', 
    paddingHorizontal: 15 
  },
  date: { 
    fontSize: 12, 
    fontWeight: '700', 
    letterSpacing: 4, 
    color: '#9F1239', 
    marginBottom: 15, 
    textTransform: 'uppercase' 
  },
  title: { 
    fontSize: 32, 
    color: '#881337', 
    textAlign: 'center', 
    marginBottom: 15, 
    fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif', 
    fontWeight: 'bold' 
  },
  separator: { 
    width: 50, 
    height: 3, 
    backgroundColor: '#FB7185', 
    marginBottom: 20, 
    borderRadius: 2 
  },
  body: { 
    fontSize: 17, 
    color: '#4c0519', 
    textAlign: 'center', 
    lineHeight: 26, 
    maxWidth: '90%', 
    fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif', 
    fontStyle: 'italic' 
  },
});
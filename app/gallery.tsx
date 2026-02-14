import React, { useMemo } from 'react';
import { StyleSheet, Text, View, Dimensions, Image, StatusBar, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { 
  useAnimatedScrollHandler, 
  useSharedValue, 
  useAnimatedStyle, 
  interpolate, 
  Extrapolation 
} from 'react-native-reanimated';

const { width, height } = Dimensions.get('window');
const TAB_BAR_HEIGHT = Platform.OS === 'ios' ? 90 : 70;
const VISIBLE_HEIGHT = height - TAB_BAR_HEIGHT;

// --- 1. SHUFFLE HELPER FUNCTION ---
const shuffleArray = (array) => {
  let shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

// --- 2. RAW DATA (Static) ---
const RAW_PHOTOS = Array.from({ length: 25 }, (_, i) => ({
  id: i + 1,
  image: (i === 0) ? require('../assets/images/img1.png') : 
         (i === 1) ? require('../assets/images/img2.png') :
         (i === 2) ? require('../assets/images/img3.png') :
         (i === 3) ? require('../assets/images/img4.png') :
         (i === 4) ? require('../assets/images/img5.png') :
         (i === 5) ? require('../assets/images/img6.png') :
         (i === 6) ? require('../assets/images/img7.png') :
         (i === 7) ? require('../assets/images/img8.png') :
         (i === 8) ? require('../assets/images/img9.png') :
         (i === 9) ? require('../assets/images/img10.png') :
         (i === 10) ? require('../assets/images/img11.png') :
         (i === 11) ? require('../assets/images/img12.png') :
         (i === 12) ? require('../assets/images/img13.png') :
         (i === 13) ? require('../assets/images/img14.png') :
         (i === 14) ? require('../assets/images/img15.png') :
         (i === 15) ? require('../assets/images/img16.png') :
         (i === 16) ? require('../assets/images/img17.png') :
         (i === 17) ? require('../assets/images/img18.png') :
         (i === 18) ? require('../assets/images/img19.png') :
         (i === 19) ? require('../assets/images/img20.png') :
         (i === 20) ? require('../assets/images/img21.png') :
         (i === 21) ? require('../assets/images/img22.png') :
         (i === 22) ? require('../assets/images/img23.png') :
         (i === 23) ? require('../assets/images/img24.png') :
         require('../assets/images/img25.png'),
  caption: [
    "Us being silly", "Late night vibes", "My favorite view", "Unforgettable", 
    "Chu Chu Mama", "Always by my side", "Our beautiful moments", "Pure happiness",
    "Everything I need", "The best partner", "You & Me", "Laughter is love",
    "Stronger together", "My Bekky Gold", "Aunty Rebe vibe", "Tech & Love",
    "Special Memories", "Heart to Heart", "Beautiful Soul", "Sweetest Smile",
    "My World", "Perfect Match", "True Love", "Endless Joy", "Happy Valentine's"
  ][i] || "Us ❤️"
}));

const GalleryItem = ({ item, index, scrollY, total }) => {
  const rStyle = useAnimatedStyle(() => {
    const inputRange = [(index - 1) * VISIBLE_HEIGHT, index * VISIBLE_HEIGHT, (index + 1) * VISIBLE_HEIGHT];
    const scale = interpolate(scrollY.value, inputRange, [0.85, 1, 0.85], Extrapolation.CLAMP);
    const opacity = interpolate(scrollY.value, inputRange, [0.5, 1, 0.5], Extrapolation.CLAMP);
    return { transform: [{ scale }], opacity };
  });

  return (
    <View style={[styles.itemContainer, { height: VISIBLE_HEIGHT }]}>
      <Animated.View style={[styles.polaroidContainer, rStyle]}>
        <View style={styles.frame}>
          <Image source={item.image} style={styles.image} resizeMode="cover" />
        </View>
        <Text style={styles.caption}>{item.caption}</Text>
        <Text style={styles.counter}>{index + 1} / {total}</Text>
      </Animated.View>
    </View>
  );
};

export default function Gallery() {
  const scrollY = useSharedValue(0);
  
  // --- 3. MEMOIZED SHUFFLE ---
  // useMemo ensures the shuffle only happens ONCE when the app starts.
  // If we don't use useMemo, the order would change every time she scrolls.
  const shuffledPhotos = useMemo(() => shuffleArray(RAW_PHOTOS), []);

  const scrollHandler = useAnimatedScrollHandler((event) => {
    scrollY.value = event.contentOffset.y;
  });

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <LinearGradient colors={['#fff1f2', '#ffe4e6', '#fecdd3']} style={StyleSheet.absoluteFill} />

      <Animated.FlatList
        data={shuffledPhotos}
        keyExtractor={(item) => item.id.toString()}
        onScroll={scrollHandler}
        pagingEnabled={false}
        snapToInterval={VISIBLE_HEIGHT}
        snapToAlignment="center"
        decelerationRate="fast"
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={16}
        renderItem={({ item, index }) => (
          <GalleryItem 
            item={item} 
            index={index} 
            scrollY={scrollY} 
            total={shuffledPhotos.length} 
          />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  itemContainer: { width: width, justifyContent: 'center', alignItems: 'center' },
  polaroidContainer: { alignItems: 'center', width: width * 0.85 },
  frame: {
    width: '100%',
    height: VISIBLE_HEIGHT * 0.65,
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 15,
    shadowColor: '#BE185D',
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 15,
  },
  image: { width: '100%', height: '100%', borderRadius: 12 },
  caption: {
    marginTop: 20,
    fontSize: 22,
    color: '#881337',
    fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  counter: {
    marginTop: 5,
    fontSize: 14,
    color: '#BE185D',
    fontStyle: 'italic',
    fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif',
    opacity: 0.8,
  }
});
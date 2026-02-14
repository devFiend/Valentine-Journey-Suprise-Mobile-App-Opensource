import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Dimensions, Platform, StatusBar, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withRepeat, 
  withTiming, 
  Easing,
  FadeInDown 
} from 'react-native-reanimated';

const { width, height } = Dimensions.get('window');
const START_DATE = new Date("2024-01-01T00:00:00"); 

// --- ANIMATED BLOB COMPONENT ---
const BreathingBlob = ({ color, size, top, left, delay }) => {
  const scale = useSharedValue(1);
  const opacity = useSharedValue(0.4);

  useEffect(() => {
    scale.value = withRepeat(
      withTiming(1.2, { duration: 4000 + delay, easing: Easing.inOut(Easing.ease) }),
      -1, true
    );
    opacity.value = withRepeat(
      withTiming(0.2, { duration: 3000 + delay, easing: Easing.inOut(Easing.ease) }),
      -1, true
    );
  }, []);

  const style = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  return (
    <Animated.View 
      style={[
        style, 
        { 
          position: 'absolute', top, left, width: size, height: size, 
          borderRadius: size / 2, backgroundColor: color, blurRadius: 40 
        } 
      ]} 
    />
  );
};

export default function Home() {
  const [time, setTime] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      const diff = now.getTime() - START_DATE.getTime();
      setTime({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((diff / 1000 / 60) % 60),
        seconds: Math.floor((diff / 1000) % 60),
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      {/* 1. Background Gradient */}
      <LinearGradient 
        colors={['#fff1f2', '#ffe4e6', '#fecdd3']} 
        style={StyleSheet.absoluteFill} 
      />
      
      {/* 2. Pastel Blobs */}
      <BreathingBlob color="#fda4af" size={300} top={-50} left={-50} delay={0} />
      <BreathingBlob color="#c084fc" size={280} top={height * 0.4} left={width * 0.5} delay={1000} />
      <BreathingBlob color="#fdba74" size={250} top={height * 0.75} left={-50} delay={2000} />
      
      {/* 3. Glass Overlay */}
      <View style={styles.glassOverlay} />

      {/* 4. Main Content */}
      <View style={styles.content}>
        
        {/* --- HEADER --- */}
        <Animated.View entering={FadeInDown.delay(200).springify()} style={styles.topLabelContainer}>
           <Text style={styles.sinceLabel}>STARTED JANUARY 1, 2024</Text>
           <View style={styles.hairline} />
        </Animated.View>

        {/* --- PHOTO CENTERPIECE --- */}
        <Animated.View entering={FadeInDown.delay(400).springify()} style={styles.photoSection}>
          <View style={styles.photoContainer}>
            
            {/* ⚠️ MAKE SURE 'homeimg.jpeg' IS IN YOUR ASSETS FOLDER */}
            <Image 
              source={require('../assets/images/homeimg.jpeg')} 
              style={styles.mainPhoto} 
            />
            <View style={styles.innerBorder} />
          </View>
          
          <Text style={styles.names}>Matthew & Bekky</Text>
          <Text style={styles.subNames}>The Love Story</Text>
        </Animated.View>

        {/* --- LUXURY TIMER --- */}
        <Animated.View entering={FadeInDown.delay(600).springify()} style={styles.timerSection}>
          <View style={styles.timerRow}>
            <TimeItem val={time.days} label="DAYS" />
            <View style={styles.separator}><Text style={styles.colon}>:</Text></View>
            <TimeItem val={time.hours} label="HRS" />
            <View style={styles.separator}><Text style={styles.colon}>:</Text></View>
            <TimeItem val={time.minutes} label="MINS" />
          </View>
          <Text style={styles.secondsText}>{time.seconds} SECONDS</Text>
        </Animated.View>

      </View>
    </View>
  );
}

const TimeItem = ({ val, label }) => (
  <View style={styles.timeItem}>
    <Text style={styles.timeVal}>{val}</Text>
    <Text style={styles.timeLabel}>{label}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  
  glassOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255,255,255,0.4)', 
  },

  content: { flex: 1, justifyContent: 'space-between', paddingVertical: 80, paddingHorizontal: 20 },

  // --- HEADER ---
  topLabelContainer: { alignItems: 'center' },
  sinceLabel: { 
    color: '#9F1239', 
    fontSize: 12, 
    letterSpacing: 4, 
    fontWeight: '700',
    opacity: 0.7 
  },
  hairline: {
    width: 40,
    height: 2,
    backgroundColor: '#9F1239',
    marginTop: 15,
    opacity: 0.3
  },

  // --- CENTER PHOTO ---
  photoSection: { alignItems: 'center', justifyContent: 'center' },
  photoContainer: {
    width: width * 0.7,
    height: width * 0.9, 
    borderRadius: 200, 
    overflow: 'hidden',
    marginBottom: 30,
    borderWidth: 4,
    borderColor: '#fff', 
    backgroundColor: '#fff1f2',
    shadowColor: '#BE185D',
    shadowOffset: { width: 0, height: 15 },
    shadowOpacity: 0.25,
    shadowRadius: 25,
    elevation: 15,
  },
  mainPhoto: { width: '100%', height: '100%', resizeMode: 'cover' },
  innerBorder: {
    ...StyleSheet.absoluteFillObject,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.6)',
    margin: 10,
    borderRadius: 190,
  },

  names: { 
    fontSize: 40, 
    color: '#881337', 
    textAlign: 'center',
    fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif',
    fontWeight: 'bold',
    letterSpacing: -1,
  },
  subNames: { 
    fontSize: 16, 
    color: '#BE185D', 
    marginTop: 5,
    fontStyle: 'italic',
    fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif',
  },

  // --- TIMER ---
  timerSection: { alignItems: 'center', marginBottom: 20 },
  timerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
  timeItem: { alignItems: 'center', minWidth: 70 },
  timeVal: { 
    fontSize: 42, 
    fontWeight: '300', 
    color: '#881337', 
    fontVariant: ['tabular-nums'], 
  },
  timeLabel: { 
    fontSize: 10, 
    color: '#BE185D', 
    marginTop: 5,
    letterSpacing: 2,
    fontWeight: '700'
  },
  separator: { height: 50, justifyContent: 'flex-start', paddingTop: 5 },
  colon: { fontSize: 30, color: '#fda4af', marginHorizontal: 5 }, 
  
  secondsText: {
    marginTop: 20,
    color: '#9F1239',
    fontSize: 12,
    letterSpacing: 3,
    fontWeight: '700',
    opacity: 0.8
  }
});
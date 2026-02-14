import { Tabs } from 'expo-router';
import { Platform } from 'react-native';
import { Heart, Home, Image as ImageIcon } from 'lucide-react-native';
import { useEffect } from 'react'; 
import { Audio } from 'expo-av';

export default function Layout() {

  // --- BACKGROUND MUSIC LOGIC ---
  useEffect(() => {
    let soundObject = null;

    async function playMusic() {
      try {
        // 1. Enable playback even in silent mode (Important for iOS)
        await Audio.setAudioModeAsync({
          playsInSilentModeIOS: true,
          staysActiveInBackground: true,
          shouldDuckAndroid: true,
        });

        // 2. Load and Play the sound
        const { sound } = await Audio.Sound.createAsync(
          require('../assets/song.mp3'), 
          { 
            shouldPlay: true, // Auto-start
            isLooping: true,  // Loop forever
            volume: 0.3,      // 30% volume (subtle background music)
          }
        );
        
        soundObject = sound;
        await sound.playAsync();
        
      } catch (error) {
        console.log("Error loading music:", error);
      }
    }

    playMusic();

    // Cleanup: Stop music if the app closes
    return () => {
      if (soundObject) {
        soundObject.unloadAsync();
      }
    };
  }, []);
  // -----------------------------

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        // Standard Tab Bar Behavior
        tabBarShowLabel: true, 
        tabBarActiveTintColor: '#E11D48', // Deep Rose
        tabBarInactiveTintColor: '#9CA3AF', // Cool Grey
        
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopWidth: 1,
          borderTopColor: '#FFE4E6', // Very subtle pink border
          height: Platform.OS === 'ios' ? 90 : 70, // Standard height handling safe areas
          paddingBottom: Platform.OS === 'ios' ? 30 : 10,
          paddingTop: 10,
          elevation: 0, // Removes Android shadow for a clean flat look
        },
        
        tabBarLabelStyle: {
          fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif', // Matches your theme
          fontSize: 11,
          fontWeight: '600',
        }
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => <Home size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="journey"
        options={{
          title: "Our Story",
          tabBarIcon: ({ color }) => (
            // The heart fills up when active
            <Heart size={24} color={color} fill={color === '#E11D48' ? '#E11D48' : 'transparent'} />
          ),
        }}
      />
      <Tabs.Screen
        name="gallery"
        options={{
          title: "Memories",
          tabBarIcon: ({ color }) => <ImageIcon size={24} color={color} />,
        }}
      />
    </Tabs>
  );
}
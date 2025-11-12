import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';
import Animated, {
    runOnJS,
    useAnimatedStyle,
    useSharedValue,
    withTiming
} from 'react-native-reanimated';
import { RightActions } from './RightActions';

type ValidRoute = 
  | '/(tabs)/home' 
  | '/(tabs)/profile' 
  | '/(tabs)/chat' 
  | '/(tabs)/profile?tab=myItems'
  | string; // Permet aussi les URLs d'action

interface NotificationItemProps {
  item: any;
  onDelete: (id: string) => void;
  colors: any;
  markAsRead: (id: string) => void;
  getNotificationIcon: (type: string) => { name: string; color: string };
  formatTime: (createdAt: string) => string;
  isSelected: boolean;
  onToggleSelection: (id: string) => void;
  selectionMode: boolean;
  getNavigationPath: (notification: any) => ValidRoute;
}

export const NotificationItem: React.FC<NotificationItemProps> = ({
  item,
  onDelete,
  colors,
  markAsRead,
  getNotificationIcon,
  getNavigationPath,
  formatTime,
  isSelected,
  onToggleSelection,
  selectionMode
}) => {
  const icon = getNotificationIcon(item.type);
  const isUnread = item.status === 'unread';
  
  const opacity = useSharedValue(1);
  const height = useSharedValue<number | undefined>(undefined);
  const marginBottom = useSharedValue(8);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
      height: height.value,
      marginBottom: marginBottom.value,
    };
  });

  const handleDelete = () => {
    opacity.value = withTiming(0, { duration: 300 });
    height.value = withTiming(0, { duration: 300 });
    marginBottom.value = withTiming(0, { duration: 300 }, (finished) => {
      if (finished) {
        runOnJS(onDelete)(item.id);
      }
    });
  };

  const handlePress = () => {
    if (selectionMode) {
      onToggleSelection(item.id);
    } else {
      if (isUnread) {
        markAsRead(item.id);
      }
      const navigationPath = getNavigationPath(item);
      // Vérifier si c'est une URL d'action ou une route Expo
        if (navigationPath.startsWith('http') || navigationPath.startsWith('/?')) {
        // Pour les URLs externes ou avec query params, utiliser navigate
        router.navigate(navigationPath as any);
        } else {
        // Pour les routes Expo standard
        router.push(navigationPath as any);
        }
    }
  };

  const handleLongPress = () => {
    if (!selectionMode) {
      onToggleSelection(item.id);
    }
  };

  return (
    <Animated.View style={[styles.swipeableContainer, animatedStyle]}>
      <Swipeable
        renderRightActions={() => !selectionMode ? (
          <RightActions onDelete={handleDelete} colors={colors} />
        ) : undefined}
        rightThreshold={40}
        containerStyle={styles.swipeableContainer}
        enabled={!selectionMode}
      >
        <TouchableOpacity 
          style={[
            styles.notificationCard, 
            { 
              backgroundColor: colors.card,
              borderLeftWidth: 4,
              borderLeftColor: isUnread ? icon.color : 'transparent',
            }
          ]}
          onPress={handlePress}
          onLongPress={handleLongPress}
          activeOpacity={selectionMode ? 0.6 : 0.7}
          delayLongPress={500}
        >
          <View style={styles.notificationContent}>
            {selectionMode && (
              <TouchableOpacity 
                style={[
                  styles.checkbox,
                  { 
                    borderColor: colors.tint,
                    backgroundColor: isSelected ? colors.tint : 'transparent'
                  }
                ]}
                onPress={() => onToggleSelection(item.id)}
              >
                {isSelected && (
                  <Ionicons name="checkmark" size={16} color="#FFF" />
                )}
              </TouchableOpacity>
            )}
            
            <View style={[
              styles.notificationMainContent,
              { marginLeft: selectionMode ? 12 : 0 }
            ]}>
              <View style={styles.notificationHeader}>
                <View style={styles.titleContainer}>
                  <Ionicons 
                    name={icon.name as any} 
                    size={16} 
                    color={icon.color} 
                    style={styles.notificationIcon}
                  />
                  <Text style={[styles.notificationTitle, { color: colors.text }]}>
                    {item.title}
                  </Text>
                </View>
                {isUnread && !selectionMode && (
                  <View style={[styles.unreadDot, { backgroundColor: colors.tint }]} />
                )}
              </View>
              
              <Text style={[styles.notificationMessage, { color: colors.textSecondary }]}>
                {item.message}
              </Text>
              
              <View style={styles.notificationFooter}>
                <Text style={[styles.notificationTime, { color: colors.textSecondary }]}>
                  {formatTime(item.created_at)}
                </Text>
                {!selectionMode && (
                  <Ionicons 
                    name="chevron-forward" 
                    size={16} 
                    color={colors.textSecondary} 
                  />
                )}
              </View>
            </View>
          </View>
        </TouchableOpacity>
      </Swipeable>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  swipeableContainer: {
    marginBottom: 8,
    borderRadius: 12,
  },
  notificationCard: { 
    borderRadius: 12,
    overflow: 'hidden',
  },
  notificationContent: {
    padding: 16,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  notificationMainContent: {
    flex: 1,
  },
  notificationHeader: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  notificationIcon: {
    marginRight: 8,
  },
  notificationTitle: { 
    fontSize: 16, 
    fontWeight: '600',
    flex: 1,
  },
  unreadDot: { 
    width: 8, 
    height: 8, 
    borderRadius: 4,
    marginLeft: 8,
    marginTop: 4,
  },
  notificationMessage: { 
    fontSize: 14, 
    marginBottom: 12,
    lineHeight: 20,
  },
  notificationFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  notificationTime: { 
    fontSize: 12, 
    fontWeight: '500',
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
});
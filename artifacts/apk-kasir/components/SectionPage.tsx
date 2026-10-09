import React, { type ReactNode } from 'react';
import { Platform, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { KeyboardAwareScrollViewCompat } from '@/components/KeyboardAwareScrollViewCompat';
import { useColors } from '@/hooks/useColors';

interface SectionPageProps {
  title: string;
  subtitle: string;
  children: ReactNode;
  floatingAction?: ReactNode;
  keyboardAware?: boolean;
}

export function SectionPage({
  title,
  subtitle,
  children,
  floatingAction,
  keyboardAware = false,
}: SectionPageProps) {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const floatingActionBottom =
    Platform.OS === 'web' ? 100 : insets.bottom + 72;
  const contentContainerStyle = [
    styles.content,
    floatingAction ? styles.contentWithFloatingAction : undefined,
  ];
  const scrollContent = (
    <>
      <View style={styles.header}>
        <Text style={[styles.eyebrow, { color: colors.primary }]}>
          RUANG USAHA
        </Text>
        <Text style={[styles.title, { color: colors.foreground }]}>{title}</Text>
        <Text style={[styles.subtitle, { color: colors.mutedForeground }]}>
          {subtitle}
        </Text>
      </View>
      {children}
    </>
  );

  return (
    <SafeAreaView
      edges={['top']}
      style={[styles.safeArea, { backgroundColor: colors.background }]}
    >
      {keyboardAware ? (
        <KeyboardAwareScrollViewCompat
          style={styles.scroll}
          bottomOffset={20}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={contentContainerStyle}
          showsVerticalScrollIndicator={false}
        >
          {scrollContent}
        </KeyboardAwareScrollViewCompat>
      ) : (
        <ScrollView
          style={styles.scroll}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={contentContainerStyle}
          showsVerticalScrollIndicator={false}
        >
          {scrollContent}
        </ScrollView>
      )}
      {floatingAction ? (
        <View
          style={[
            styles.floatingActionPosition,
            { bottom: floatingActionBottom, pointerEvents: 'box-none' },
          ]}
        >
          {floatingAction}
        </View>
      ) : null}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  scroll: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
    paddingBottom: 108,
    paddingHorizontal: 22,
    paddingTop: 15,
  },
  contentWithFloatingAction: {
    paddingBottom: 180,
  },
  floatingActionPosition: {
    position: 'absolute',
    right: 22,
  },
  header: {
    marginBottom: 25,
  },
  eyebrow: {
    fontFamily: 'Inter_700Bold',
    fontSize: 10,
    letterSpacing: 1.7,
    marginBottom: 9,
  },
  title: {
    fontFamily: 'Inter_700Bold',
    fontSize: 30,
    letterSpacing: -0.8,
    lineHeight: 37,
  },
  subtitle: {
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    lineHeight: 21,
    marginTop: 7,
    maxWidth: 330,
  },
});

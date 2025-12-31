import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { BannerAd, BannerAdSize } from 'react-native-google-mobile-ads';
import { ADS_CONFIG, getAdUnitIds } from '../constants/adsConfig';

const BannerAdComponent: React.FC = () => {
  if (!ADS_CONFIG.ENABLE_ADS) {
    return null;
  }

  const adUnitIds = getAdUnitIds();

  return (
    <View style={styles.container}>
      <BannerAd
        unitId={adUnitIds.BANNER}
        size={BannerAdSize.BANNER}
        onAdLoaded={() => {
          console.log('Banner ad loaded successfully');
        }}
        onAdFailedToLoad={(error) => {
          console.error('Banner ad failed to load:', error);
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 8,
  },
});

export default BannerAdComponent;

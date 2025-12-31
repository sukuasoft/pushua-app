import GoogleMobileAds, {
  InterstitialAd,
  BannerAd,
  RewardedAd,
  BannerAdSize,
  RewardedAdEventType,
  AdEventType,
} from 'react-native-google-mobile-ads';
import { ADS_CONFIG, getAdUnitIds } from '../constants/adsConfig';
import { Platform, StatusBar } from 'react-native';

// Initialize Google Mobile Ads
export const initializeAds = async () => {
  // Se ads estão desabilitados, não inicializa
  if (!ADS_CONFIG.ENABLE_ADS) {
    console.log('Ads estão desabilitados');
    return;
  }

  try {
    await GoogleMobileAds().initialize();
    const adMode = ADS_CONFIG.USE_TEST_ADS ? 'TESTE' : 'PRODUÇÃO';
    console.log(`Google Mobile Ads initialized successfully (Modo: ${adMode})`);
  } catch (error) {
    console.error('Failed to initialize Google Mobile Ads:', error);
  }
};

// Interstitial Ad Manager
export const createInterstitialAd = () => {
  const adUnitIds = getAdUnitIds();
  return InterstitialAd.createForAdRequest(adUnitIds.INTERSTITIAL);
};

export const loadAndShowInterstitialAd = async () => {
  return new Promise((resolve, reject) => {
    // Se ads estão desabilitados, retorna null
    if (!ADS_CONFIG.ENABLE_ADS) {
      console.log('Ads estão desabilitados');
      resolve(null);
      return;
    }

    try {
      const interstitialAd = createInterstitialAd();

      interstitialAd.addAdEventListener(AdEventType.LOADED, () => {
        interstitialAd.show();
        resolve(interstitialAd);
      });

      interstitialAd.addAdEventListener(AdEventType.OPENED, () => {
        if (Platform.OS === 'ios') {
          StatusBar.setHidden(true);
        }
      });

      interstitialAd.addAdEventListener(AdEventType.CLOSED, () => {
        if (Platform.OS === 'ios') {
          StatusBar.setHidden(false);
        }
      });

      interstitialAd.load();
    } catch (error) {
      console.error('Failed to load/show interstitial ad:', error);
      reject(error);
    }
  });
};

// Rewarded Ad Manager
export const createRewardedAd = () => {
  const adUnitIds = getAdUnitIds();
  return RewardedAd.createForAdRequest(adUnitIds.REWARDED);
};

export const loadAndShowRewardedAd = async () => {
  return new Promise((resolve, reject) => {
    // Se ads estão desabilitados, retorna null
    if (!ADS_CONFIG.ENABLE_ADS) {
      console.log('Ads estão desabilitados');
      resolve(null);
      return;
    }

    try {
      const rewardedAd = createRewardedAd();

      rewardedAd.addAdEventListener(RewardedAdEventType.EARNED_REWARD, (reward) => {
        console.log('User earned reward of ', reward);
      });

      rewardedAd.addAdEventListener(RewardedAdEventType.LOADED, () => {
        rewardedAd.show();
        resolve(rewardedAd);
      });
      rewardedAd.load();
    } catch (error) {
      console.error('Failed to load/show rewarded ad:', error);
      reject(error);
    }
  });
};

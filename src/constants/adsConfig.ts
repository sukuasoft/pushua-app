/**
 * Configuração de Ads
 */

import { TestIds } from "react-native-google-mobile-ads";

export const ADS_CONFIG = {
  // Define se os ads estão habilitados globalmente
  ENABLE_ADS: true,

  // Define se usa Ad Unit IDs de teste ou de produção
  USE_TEST_ADS: __DEV__,

  // Ad Unit IDs de Produção
  PRODUCTION_AD_UNIT_IDS: {
    BANNER: 'ca-app-pub-9859105175738939/7896760095',
    INTERSTITIAL: 'ca-app-pub-9859105175738939/1429416481',
    REWARDED: 'ca-app-pub-9859105175738939/3055496956',
  },

  // Ad Unit IDs de Teste do Google
  TEST_AD_UNIT_IDS: {
    BANNER: TestIds.BANNER,
    INTERSTITIAL: TestIds.INTERSTITIAL,
    REWARDED: TestIds.REWARDED,
  },
};

// Helper para obter o AD_UNIT_IDS correto baseado na flag
export const getAdUnitIds = () => {
  return ADS_CONFIG.USE_TEST_ADS 
    ? ADS_CONFIG.TEST_AD_UNIT_IDS 
    : ADS_CONFIG.PRODUCTION_AD_UNIT_IDS;
};

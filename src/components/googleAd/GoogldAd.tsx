import { useEffect } from 'react';

declare global {
  interface Window {
    adsbygoogle: any;
  }
}

const GoogleAd = () => {
  useEffect(() => {
    (window.adsbygoogle = window.adsbygoogle || []).push({});
  }, []);

  return (
    <div className="googleAd-container">
      <ins
        className="adsbygoogle"
        style={{ display: 'block', overflow: 'hidden' }}
        data-ad-slot="9541709216"
        data-ad-format="auto"
        data-full-width-responsive="true"
        data-ad-client={process.env.GOOGLE_ADSENSE_ID}
      />
    </div>
  );
};

export default GoogleAd;
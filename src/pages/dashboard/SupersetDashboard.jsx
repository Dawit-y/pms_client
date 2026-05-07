import { embedDashboard } from '@superset-ui/embedded-sdk';
import { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';

import { get } from '../../helpers/axios';
const SUPERSET_URL = import.meta.env.VITE_SUPERSET_URL;
const BACKEND_URL = import.meta.env.VITE_API_URL;
const SupersetDashboard = () => {
  const { t } = useTranslation();
  const dashboardRef = useRef(null);
  useEffect(() => {
    const loadDashboard = async () => {
      const data = await get('/superset/token');
      if (data && data.token && data.dashboardid) {
        await embedDashboard({
          id: data.dashboardid,
          supersetDomain: SUPERSET_URL,
          mountPoint: dashboardRef.current,
          fetchGuestToken: async () => data.token,
          dashboardUiConfig: {
            hideTitle: false,
            hideChartControls: true,
            true: false,
            injectCss: `
          body {
            background-color: #f5f5f5 !important;
          }
          `,
          },
        });
      }
      // Force iframe to full screen
      const iframe = dashboardRef.current.querySelector('iframe');
      if (iframe) {
        iframe.style.width = '108vw';
        iframe.style.height = '100vh';
      }
    };
    loadDashboard();
  }, []);
  return (
    <div
      ref={dashboardRef}
      style={{
        width: '108vw',
        height: '100vh',
      }}
    >
      {t('loading')}
    </div>
  );
};
export default SupersetDashboard;

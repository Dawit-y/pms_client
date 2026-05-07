import { PDFViewer } from '@embedpdf/react-pdf-viewer';
import { useRef, useEffect } from 'react';
import { useSelector } from 'react-redux';

import { layoutSelectors } from '../../store/layout/layoutSlice';

export default function PdfViewer({ filePath }) {
  const viewerRef = useRef(null);
  const { selectLayoutModeType } = layoutSelectors;
  const layoutModeType = useSelector(selectLayoutModeType);

  useEffect(() => {
    viewerRef.current?.container?.setTheme({ preference: layoutModeType });
  }, [layoutModeType, viewerRef]);

  return (
    <div
      className="border overflow-hidden rounded-3 w-100"
      style={{ height: '600px' }}
    >
      <PDFViewer
        ref={viewerRef}
        config={{
          src: filePath,
          theme: {
            preference: layoutModeType,
            light: {
              accent: {
                primary: '#0c5c35',
                primaryHover: '#09492a',
                primaryActive: '#063720',
                primaryLight: '#e6f4ee',
                primaryForeground: '#ffffff',
              },
            },
            dark: {
              accent: {
                primary: '#1f8a57',
                primaryHover: '#187347',
                primaryActive: '#125c38',
                primaryLight: '#0f3d2a',
                primaryForeground: '#ffffff',
              },
            },
          },
          disabledCategories: [
            'annotation',
            'shapes',
            'redaction',
            'document-open',
            'document-close',
            'document-protect',
          ],
        }}
        style={{ width: '100%', height: '100%' }}
      />
    </div>
  );
}

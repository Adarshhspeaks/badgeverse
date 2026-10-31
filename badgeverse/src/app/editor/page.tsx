'use client';

import { useState, useEffect } from 'react';
import { useEditorStore } from '@/store/editor';
import { templates } from '@/lib/template-data';
import { LeftPanel } from '@/components/editor/LeftPanel';
import { Toolbar } from '@/components/editor/Toolbar';
import { Canvas } from '@/components/editor/Canvas';
import { PropsPanel } from '@/components/editor/PropsPanel';
import { Toast } from '@/components/ui/Toast';

export default function EditorPage() {
  const { templateId, loadTemplate } = useEditorStore();
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Initialize with first template if none is loaded
  useEffect(() => {
    if (!templateId && templates.length > 0) {
      loadTemplate(templates[0]);
    }
  }, [templateId, loadTemplate]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 2200);
  };

  return (
    <>
      <div className="ed">
        <LeftPanel onToast={showToast} />
        <main className="stage">
          <Toolbar />
          <Canvas />
        </main>
        <PropsPanel onToast={showToast} />
      </div>

      <Toast message={toastMessage} />
    </>
  );
}

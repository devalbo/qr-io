import React from 'react';
import { ContentIndexPage } from '../../../src/components/content-page/ContentIndexPage';
import { useApp } from '@/src/contexts/AppContext';
import { ContentStreamsPage } from './streams';


export const ContentIndexTab = () => {
  const { settings } = useApp();

  if (!settings.debugMode) {
    return (
      <ContentStreamsPage />
    )
  }

  return (
    <ContentIndexPage />
  )
}

export default ContentIndexTab;

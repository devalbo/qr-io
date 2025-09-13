import React, { useCallback, useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  StyleSheet,
  Platform
} from 'react-native';
import { useApp } from '../../contexts/AppContext';
import { LoadingSpinner } from '../LoadingSpinner';
import { QrIoFramesDisplay } from '../QrIoFramesDisplay';
import { ContentTypeAndData } from '../qr-io-frames-types';
import { GenericTabControl } from '../GenericTabControl';
import { TextContent } from './text-content';
import { FileContent } from './file-content';
import { JsonViewContent } from './json-view-content';
import { QrDataFrame } from '@/protobufs/protofiles-out/qr-io';
import { convertContentTxDataToQrDataFrames } from '@/src/utils/qrdata-utils';
import { DebugContent } from '../import-page/debug-content';
import * as DocumentPicker from 'expo-document-picker';
import { useFocusEffect } from '@react-navigation/native';
import { useFileIntent } from '../../contexts/FileIntentContext';



const DEFAULT_TEXT_CONTENT = 'abcdefgh';

type ExportTabKey = 'text' | 'file' | 'qr' | 'json' | 'debug';

const BASE_EXPORT_SECTIONS = [
  { value: 'text' as ExportTabKey, label: 'Text Input', icon: '📝' },
  { value: 'file' as ExportTabKey, label: 'File Selection', icon: '📁' },
  { value: 'qr' as ExportTabKey, label: 'QR Code', icon: '📱' },
];

const DEBUG_EXPORT_SECTIONS = [
  { value: 'json' as ExportTabKey, label: 'JSON View', icon: '📄' },
  { value: 'debug' as ExportTabKey, label: 'Debug', icon: '🐛' },
];

export const ExportPage = () => {
  const { isLoading, settings } = useApp();
  const { sharedFile } = useFileIntent();
  const [lastExportResult, setLastExportResult] = useState<string>('');
  
  const [activeTab, setActiveTab] = useState<ExportTabKey>('qr');
  const [isAutoplaying, setIsAutoplaying] = useState(false);

  const { maxBytesPerQrCode, qrTransmissionRate, debugMode } = settings;

  // Create conditional export sections based on debug mode
  const exportSections = debugMode 
    ? [...BASE_EXPORT_SECTIONS, ...DEBUG_EXPORT_SECTIONS]
    : BASE_EXPORT_SECTIONS;

  const [frames, setFrames] = useState<QrDataFrame[]>([]);
  const [activeFrameIndex, setActiveFrameIndex] = useState(0);
  const [selectedFile, setSelectedFile] = useState<DocumentPicker.DocumentPickerResult | null>(null);

  const [content, setContent] = useState<ContentTypeAndData>({
    contentTitle: 'qr-io-text-' + DEFAULT_TEXT_CONTENT,
    contentMimeType: 'text/plain',
    content: {
      oneofKind: 'textContent',
      textContent: DEFAULT_TEXT_CONTENT,
    },
    contentLength: DEFAULT_TEXT_CONTENT.length,
  });

  // Handle shared file from intent
  useEffect(() => {
    if (sharedFile) {
      setContent(sharedFile.content);
      setActiveTab('file');
    }
  }, [sharedFile]);

  useEffect(() => {
    convertContentTxDataToQrDataFrames(content, maxBytesPerQrCode)
      .then(result => {
        setFrames(result);
      })
      .catch(error => {
        console.error(error);
      });
    
  }, [content, maxBytesPerQrCode]);

  useFocusEffect(
    useCallback(() => {
      return () => {
        setIsAutoplaying(false);
      };
    }, [])
  );


  const handleTextChange = (text: string) => {
    const textTitle = text.trim().slice(0, 10);
    setContent({
      ...content,
      contentTitle: 'qr-io-text-' + textTitle,
      content: {
        oneofKind: 'textContent',
        textContent: text,
      },
    });
  };

  const handleUseText = () => {
    setSelectedFile(null);
    setContent({
      ...content,
      contentTitle: 'qr-io-text-',
      contentMimeType: 'text/plain',
      content: {
        oneofKind: 'textContent',
        textContent: '',
      },
      contentLength: 0,
    });
  };

  const handleTabChange = (newTab: ExportTabKey) => {
    setActiveTab(newTab);
  };

  // Handle tab switching when debug mode changes
  useEffect(() => {
    if (!debugMode && (activeTab === 'json' || activeTab === 'debug')) {
      setActiveTab('qr');
    }
  }, [debugMode, activeTab]);

  const renderActiveSection = () => {
    switch (activeTab) {
      case 'text':
        return (
          <TextContent 
            content={content} 
            handleTextChange={handleTextChange}
            onUseText={handleUseText}
          />
        );
      case 'file':
        return (
          <FileContent 
            content={content} 
            handleBytesChange={handleBytesChange}
            selectedFile={selectedFile}
            onSelectedFileChange={setSelectedFile}
          />
        );
      case 'qr':
        return (
          <QrIoFramesDisplay 
            frames={frames}
            activeFrameIndex={activeFrameIndex}
            framesPerSecond={qrTransmissionRate}
            maxBytesPerQrCode={maxBytesPerQrCode}
            onPreviousFrame={handlePreviousFrame}
            onNextFrame={handleNextFrame}
            isAutoplaying={isAutoplaying}
            startAutoplay={handleStartAutoplay}
            stopAutoplay={handleStopAutoplay}
          />
        );
      case 'json':
        return (
          <JsonViewContent 
            frames={frames}
            activeFrameIndex={activeFrameIndex}
            framesPerSecond={qrTransmissionRate}
            onPreviousFrame={handlePreviousFrame}
            onNextFrame={handleNextFrame}
            isAutoplaying={isAutoplaying}
            startAutoplay={handleStartAutoplay}
            stopAutoplay={handleStopAutoplay}
          />
        );
      case 'debug':
        return (
          <DebugContent 
            frames={frames}
            activeFrameIndex={activeFrameIndex}
          />
        );
      default:
        return null;
    }
  };

  const handleBytesChange = (contentName: string, contentMimeType: string, bytes: Uint8Array) => {
    setContent({
      ...content,
      contentTitle: contentName,
      contentMimeType,
      content: {
        oneofKind: 'bytesContent',
        bytesContent: bytes,
      },
    });
  };

  const handleStartAutoplay = () => {
    setIsAutoplaying(true);
  };

  const handleStopAutoplay = () => {
    setIsAutoplaying(false);
  };

  // const isDataAvailable = 
  //   content !== null && 
  //   content !== undefined &&
  //   ((content.content.oneofKind === 'textContent' && content.content.textContent.length > 0) ||
  //    (content.content.oneofKind === 'bytesContent' && content.content.bytesContent.length > 0));

  if (isLoading) {
    return <LoadingSpinner message="Exporting data..." />;
  }

  const handlePreviousFrame = () => {
    if (frames.length > 0) {
      setActiveFrameIndex(prev => prev === 0 ? frames.length - 1 : prev - 1);
    }
  };

  const handleNextFrame = () => {
    if (frames.length > 0) {
      setActiveFrameIndex(prev => prev === frames.length - 1 ? 0 : prev + 1);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Export Data</Text>
      </View>

      <View style={styles.ioSection}>
        <View style={styles.tabContainer}>
          <GenericTabControl
            options={exportSections}
            selectedValue={activeTab}
            onValueChange={handleTabChange}
          />
        </View>

        {renderActiveSection()}
      </View>

      {lastExportResult ? (
        <View style={styles.resultSection}>
          <Text style={styles.resultTitle}>Last Export Result:</Text>
          <Text style={styles.resultText}>{lastExportResult}</Text>
        </View>
      ) : null}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    lineHeight: 22,
  },
  ioSection: {
    flex: 1,
    backgroundColor: '#fff',
    // margin: 8,
    padding: 8,
    // borderRadius: 12,
    // shadowColor: '#000',
    // shadowOffset: { width: 0, height: 2 },
    // shadowOpacity: 0.1,
    // shadowRadius: 4,
    // elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
  },
  sectionText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  tabContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#fff',
  },
  // inputSection: {
  //   marginBottom: 20,
  // },
  // textInput: {
  //   borderWidth: 1,
  //   borderColor: '#ddd',
  //   borderRadius: 8,
  //   padding: 12,
  //   fontSize: 16,
  //   minHeight: 120,
  //   textAlignVertical: 'top',
  //   backgroundColor: '#fafafa',
  // },
  // filePickerButton: {
  //   backgroundColor: '#007AFF',
  //   paddingVertical: 12,
  //   paddingHorizontal: 20,
  //   borderRadius: 8,
  //   alignItems: 'center',
  // },
  // filePickerButtonText: {
  //   color: '#fff',
  //   fontSize: 16,
  //   fontWeight: '600',
  // },
  // fileInfo: {
  //   marginTop: 12,
  //   padding: 12,
  //   backgroundColor: '#f8f9fa',
  //   borderRadius: 8,
  //   borderWidth: 1,
  //   borderColor: '#e9ecef',
  // },
  // fileName: {
  //   fontSize: 14,
  //   fontWeight: '600',
  //   color: '#333',
  //   marginBottom: 4,
  // },
  // fileSize: {
  //   fontSize: 12,
  //   color: '#666',
  //   marginBottom: 4,
  // },
  // dataSourceIndicator: {
  //   fontSize: 12,
  //   color: '#28a745',
  //   fontWeight: '600',
  //   marginTop: 8,
  // },
  // noDataMessage: {
  //   alignItems: 'center',
  //   paddingVertical: 20,
  // },
  // noDataText: {
  //   fontSize: 16,
  //   color: '#666',
  //   fontStyle: 'italic',
  // },
  resultSection: {
    backgroundColor: '#fff',
    margin: 16,
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  resultTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  resultText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  jsonSection: {
    marginTop: 20,
    padding: 15,
    backgroundColor: '#f8f9fa',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  jsonTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  jsonDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
  },
  jsonContainer: {
    maxHeight: 300,
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  jsonText: {
    fontSize: 12,
    color: '#333',
    lineHeight: 18,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
});

import { StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { ContentTypeAndData } from "../qr-io-frames-types";


interface TextContentProps {
  content: ContentTypeAndData | null;
  handleTextChange: (text: string) => void;
  onUseText: () => void;
}

export const TextContent = ({ content, handleTextChange, onUseText }: TextContentProps) => {
  if (content?.content.oneofKind !== 'textContent') {
    
    return (
      <View style={styles.inputSection}>
        <Text style={styles.noDataText}>Content is not text</Text>
        <TouchableOpacity 
          style={styles.convertButton} 
          onPress={onUseText}
        >
          <Text style={styles.convertButtonText}>Use Text</Text>
        </TouchableOpacity>
      </View>
    )
  }

  const textInput = content.content.textContent;
  
  return (
    <View style={styles.inputSection}>
      <TextInput
        style={styles.textInput}
        placeholder="Paste or type your content here..."
        value={textInput}
        onChangeText={handleTextChange}
        multiline
        numberOfLines={6}
        textAlignVertical="top"
      />
      {textInput.trim() ? (
        <Text style={styles.dataSourceIndicator}>✓ Text data ready ({textInput.trim().length} characters)</Text>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  inputSection: {
    marginBottom: 20,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    minHeight: 120,
    textAlignVertical: 'top',
    backgroundColor: '#fafafa',
  },
  dataSourceIndicator: {
    fontSize: 12,
    color: '#28a745',
    fontWeight: '600',
    marginTop: 8,
  },
  noDataText: {
    fontSize: 16,
    color: '#666',
    fontStyle: 'italic',
  },
  convertButton: {
    backgroundColor: '#007bff',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignSelf: 'flex-start',
    marginTop: 10,
  },
  convertButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
});

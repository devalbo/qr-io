import { Stack } from "expo-router";

export const ImportLayout = () => {
  return (
    <Stack
      screenOptions={{
        headerShown: true,
        headerBackVisible: true,
        headerBackTitle: "Back",
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          title: "QrIo Import",
        }}
      />

      <Stack.Screen
        name="frame-inspector"
        options={{
          title: "Frame Inspector",
          headerBackVisible: true,
          headerBackTitle: "Back",
        }}
      />

      <Stack.Screen
        name="stream-scanner"
        options={{
          title: "Stream Scanner",
          headerBackVisible: true,
          headerBackTitle: "Back",
        }}
      />

      {/* <Stack.Screen
        name="raw"
        options={{
          title: "Raw",
          headerBackVisible: true,
          headerBackTitle: "Back",
        }}
      /> */}
    </Stack>
  );
}

export default ImportLayout;

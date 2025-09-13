import { Stack } from "expo-router";

export const ContentLayout = () => {
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
          headerBackVisible: true,
          headerBackTitle: "fsdfdsa",
        }}
      />

      <Stack.Screen
        name="frames"
        options={{
          title: "Frames",
          headerBackVisible: true,
          headerBackTitle: "Back",
        }}
      />

      <Stack.Screen
        name="streams"
        options={{
          title: "Content Streams",
          headerBackVisible: true,
          headerBackTitle: "Back",
        }}
      />

      <Stack.Screen
        name="streams/index"
        options={{
          title: "Streams",
          headerBackVisible: true,
          headerBackTitle: "Back",
        }}
      />

      <Stack.Screen
        name="streams/[streamId]"
        options={{
          title: "Stream Details",
          headerBackVisible: true,
          headerBackTitle: "Back",
        }}
      />
    </Stack>
  );
}

export default ContentLayout;

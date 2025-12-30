import { Colors } from "@/constants/theme";
import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";


type AppWrapperProps = {
    children: React.ReactNode;
}

export default function AppWrapper({ children }: AppWrapperProps) {

    const insets = useSafeAreaInsets();

    return (
        <View style={{
            flex: 1,
            backgroundColor: Colors.black,
            paddingTop: insets.top,
        }}>
            {children}

        </View>
    )

}
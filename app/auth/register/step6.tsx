import RegisterHeader from "@/components/register/RegisterHeader";
import { View } from "react-native";
import PasswordInput from "@/components/register/PasswordInput";
import CustomButton from "@/components/CustomButton";
import { useState } from "react";

export default function RegisterStep6() {

    const [password, setPassword] = useState('');
    const [isPasswordValid, setIsPasswordValid] = useState(false);

    return (
        <View className="flex-1 gap-6">
            <RegisterHeader stepCount={6} currentPosition={6} />
            <View className="flex-1 px-4">
                <PasswordInput value={password} onChange={setPassword} onValidationChange={setIsPasswordValid} />
                <View className="mt-auto mb-4">
                    <CustomButton large title="Create Account" disabled={!isPasswordValid}/>
                </View>
            </View>
        </View>
    )
}
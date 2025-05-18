import i18n from "@/i18n";
import api from "@/lib/api";
import React, { useCallback } from "react";
import { View, ScrollView, RefreshControl, ActivityIndicator } from "react-native";
import { router } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import { ChallengeSimple } from "@/types/Challenge";
import { PlusIcon, UserGroupIcon } from "react-native-heroicons/outline";
import ChallengeItem from "@/components/challenges/ChallengeItem";
import Text from "@/components/common/Text";
import ChallengesHeader from "@/components/challenges/ChallengesHeader";
import UserInterface from "@/types/UserInterface";
import Button from "@/components/common/Button";
import Icon from "@/components/common/Icon";
import NetworkErrorContainer from "@/components/common/NetworkErrorContainer";
import ChallengeRightSection from "@/components/challenges/ChallengeRightSection";
import ChallengeInviteRightSection from "@/components/challenges/ChallengeInviteRightSection";
import ChallengesList from "@/components/challenges/ChallengesList";

interface Invitation extends ChallengeSimple {
    sender: UserInterface;
    invitation_id: string;
}

interface ChallengesResponse {
    owned_challenges: ChallengeSimple[];
    participating_challenges: ChallengeSimple[];
    invitations: Invitation[];
}

interface Friend extends UserInterface {
    mutual_streak: number;
}

export default function ChallengesPage() {

    return (
        <>
            <ChallengesHeader />

            <ChallengesList />
        </>
    )
}
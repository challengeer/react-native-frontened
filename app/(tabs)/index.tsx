import { useEffect, useState } from 'react';
import { Text, View } from 'react-native';

interface User {
  user_id: string
  display_name: string
  username: string
}

export default function HomeScreen() {
  const [users, setUsers] = useState<User[] | []>([]);

  useEffect(() => {
    fetch("http://localhost:8000/users/3/friends")
      .then((response) => response.json())
      .then((data) => setUsers(data))
  }, [])

  return (
    <View className="bg-white flex-1 p-4">
      {users.map((user: User) => (
        <View key={user.user_id} className="flex-row gap-2 items-center py-3 border-b border-neutral-100">
          <View className="w-11 h-11 bg-neutral-100 rounded-full"></View>
          <View className="gap-1">
            <Text className="leading-none text-lg font-semibold">a{user.display_name}</Text>
            <Text className="leading-none text-neutral-500">@{user.username}</Text>
          </View>
        </View>
      ))}
    </View>
  );
}